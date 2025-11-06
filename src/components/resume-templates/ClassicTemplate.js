import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 12,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 3,
  },
});

const ClassicTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>{data.profile.full_name}</Text>
        <Text style={styles.content}>{data.profile.email}</Text>
        <Text style={styles.content}>{data.profile.headline}</Text>
        <Text style={styles.content}>{data.profile.generic_summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Work Experience</Text>
        {data.work_experience.map((exp) => (
          <View key={exp.id} style={styles.section}>
            <Text style={styles.content}>{exp.job_title} at {exp.company}</Text>
            <Text style={styles.content}>{exp.start_date} - {exp.end_date}</Text>
            {exp.responsibilities.map((resp, i) => (
              <Text key={i} style={styles.listItem}>- {resp}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Education</Text>
        {data.education.map((edu) => (
          <View key={edu.id} style={styles.section}>
            <Text style={styles.content}>{edu.institution}</Text>
            <Text style={styles.content}>{edu.degree} in {edu.field_of_study}</Text>
            <Text style={styles.content}>Graduated: {edu.graduation_date}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Skills</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {data.skills.map((skill) => (
            <Text key={skill.id} style={{ marginRight: 10 }}>{skill.skill_name}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default ClassicTemplate;
