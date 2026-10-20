/**
 * 1D K-Means Clustering Algorithm (k=3)
 * Groups employee salaries into 3 distinct tiers:
 * Tier 1 (Lowest salary group), Tier 2 (Middle salary group), Tier 3 (Highest salary group)
 */

function kMeans1D(salaries, k = 3, maxIterations = 100) {
  // Validate and parse numeric inputs
  const validSalaries = salaries
    .map(Number)
    .filter(val => !isNaN(val) && val >= 0);

  if (validSalaries.length === 0) {
    return [
      { group: 'Tier 1', centroid: 0, count: 0 },
      { group: 'Tier 2', centroid: 0, count: 0 },
      { group: 'Tier 3', centroid: 0, count: 0 }
    ];
  }

  // Sort ascending
  validSalaries.sort((a, b) => a - b);
  const n = validSalaries.length;

  const uniqueValues = [...new Set(validSalaries)];
  if (uniqueValues.length === 1) {
    return [
      { group: 'Tier 1', centroid: Math.round(validSalaries[0]), count: validSalaries.length },
      { group: 'Tier 2', centroid: 0, count: 0 },
      { group: 'Tier 3', centroid: 0, count: 0 }
    ];
  }

  if (n === 2) {
    return [
      { group: 'Tier 1', centroid: Math.round(validSalaries[0]), count: 1 },
      { group: 'Tier 2', centroid: Math.round(validSalaries[1]), count: 1 },
      { group: 'Tier 3', centroid: 0, count: 0 }
    ];
  }

  // Initial centroid selection using quantiles for balanced convergence
  let centroids = [
    validSalaries[Math.floor(n * 0.16)],
    validSalaries[Math.floor(n * 0.50)],
    validSalaries[Math.floor(n * 0.83)]
  ];

  // If initial centroids collapse together, use linear interpolation
  if (centroids[0] === centroids[1] || centroids[1] === centroids[2]) {
    const min = validSalaries[0];
    const max = validSalaries[n - 1];
    const step = (max - min) / (k + 1);
    centroids = [
      min + step,
      min + 2 * step,
      min + 3 * step
    ];
  }

  let clusterAssignments = Array.from({ length: k }, () => []);

  for (let iter = 0; iter < maxIterations; iter++) {
    clusterAssignments = Array.from({ length: k }, () => []);

    // Assign each salary to the closest centroid
    for (const salary of validSalaries) {
      let bestCluster = 0;
      let minDistance = Infinity;

      for (let i = 0; i < k; i++) {
        const dist = Math.abs(salary - centroids[i]);
        if (dist < minDistance) {
          minDistance = dist;
          bestCluster = i;
        }
      }
      clusterAssignments[bestCluster].push(salary);
    }

    // Recompute centroids as the mean of assigned data points
    let converged = true;
    for (let i = 0; i < k; i++) {
      if (clusterAssignments[i].length > 0) {
        const sum = clusterAssignments[i].reduce((acc, curr) => acc + curr, 0);
        const newCentroid = sum / clusterAssignments[i].length;
        if (Math.abs(newCentroid - centroids[i]) > 0.001) {
          converged = false;
        }
        centroids[i] = newCentroid;
      }
    }

    if (converged) break;
  }

  // Build cluster results
  const rawClusters = centroids.map((c, i) => ({
    centroid: clusterAssignments[i].length > 0 ? c : 0,
    count: clusterAssignments[i].length
  }));

  // Sort clusters ascending by centroid
  rawClusters.sort((a, b) => a.centroid - b.centroid);

  // Label as Tier 1, Tier 2, Tier 3
  return rawClusters.map((cluster, index) => ({
    group: `Tier ${index + 1}`,
    centroid: Math.round(cluster.centroid),
    count: cluster.count
  }));
}

module.exports = { kMeans1D };
