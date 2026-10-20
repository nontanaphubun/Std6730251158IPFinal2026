import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TIER_COLORS = {
  'Tier 1': {
    primary: '#0284c7',
    bg: '#0c4a6e',
    badge: '#38bdf8',
    label: 'Entry / Junior Tier'
  },
  'Tier 2': {
    primary: '#d97706',
    bg: '#78350f',
    badge: '#fbbf24',
    label: 'Mid-Level Specialist'
  },
  'Tier 3': {
    primary: '#059669',
    bg: '#064e3b',
    badge: '#34d399',
    label: 'Senior / Leadership'
  }
};

export default function ClusterSummary({ clusters }) {
  if (!clusters || clusters.length === 0) {
    return null;
  }

  const totalEmployees = clusters.reduce((sum, c) => sum + (c.count || 0), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🧠 K-Means Salary Analytics (k=3)</Text>
          <Text style={styles.subtitle}>
            Total Employees Clustered: <Text style={styles.bold}>{totalEmployees}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.cardsRow}>
        {clusters.map((cluster, idx) => {
          const config = TIER_COLORS[cluster.group] || {
            primary: '#6366f1',
            bg: '#312e81',
            badge: '#a5b4fc',
            label: 'Salary Tier'
          };
          const percentage = totalEmployees > 0 ? Math.round((cluster.count / totalEmployees) * 100) : 0;

          return (
            <View key={cluster.group || idx} style={[styles.card, { borderColor: config.primary }]}>
              <View style={[styles.cardTop, { backgroundColor: config.bg }]}>
                <Text style={[styles.tierTitle, { color: config.badge }]}>{cluster.group}</Text>
                <Text style={styles.tierSub}>{config.label}</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Average (Centroid):</Text>
                  <Text style={[styles.centroidValue, { color: config.badge }]}>
                    ฿{Number(cluster.centroid || 0).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Employee Count:</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{cluster.count} {cluster.count === 1 ? 'Person' : 'People'}</Text>
                  </View>
                </View>

                {/* Progress bar visual */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%`, backgroundColor: config.primary }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{percentage}% of workforce</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  header: {
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8'
  },
  bold: {
    fontWeight: '700',
    color: '#60a5fa'
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  },
  card: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden'
  },
  cardTop: {
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  tierSub: {
    fontSize: 11,
    color: '#cbd5e1',
    marginTop: 2
  },
  cardBody: {
    padding: 14
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500'
  },
  centroidValue: {
    fontSize: 18,
    fontWeight: '800'
  },
  countBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  countText: {
    color: '#f1f5f9',
    fontSize: 12,
    fontWeight: '700'
  },
  progressContainer: {
    marginTop: 6
  },
  progressBg: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 3
  },
  progressText: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 4
  }
});
