import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  leftColumn: {
    flexDirection: 'column',
    width: '30%',
    padding: 20,
    backgroundColor: '#2c3e50',
    color: '#ffffff',
  },
  rightColumn: {
    flexDirection: 'column',
    width: '70%',
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#3498db',
  },
  content: {
    fontSize: 11,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 11,
    marginBottom: 3,
  },
});

const ModernTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.leftColumn}>
        <Text style={styles.heading}>{data.profile.full_name}</Text>
        <Text style={styles.content}>{data.profile.email}</Text>
        <Text style={styles.content}>{data.profile.headline}</Text>
      </View>
      <View style={styles.rightColumn}>
        <View style={styles.section}>
          <Text style={styles.subheading}>Summary</Text>
          <Text style={styles.content}>{data.profile.generic_summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>Work Experience</Text>
          {data.work_experience.map((exp, i) => (
            <View key={i} style={styles.section}>
              <Text style={{...styles.content, fontWeight: 'bold'}}>{exp.job_title} at {exp.company}</Text>
              <Text style={styles.content}>{exp.start_date} - {exp.end_date}</Text>
              {exp.responsibilities.map((resp, j) => (
                <Text key={j} style={styles.listItem}>- {resp}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>Education</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={styles.section}>
              <Text style={{...styles.content, fontWeight: 'bold'}}>{edu.institution}</Text>
              <Text style={styles.content}>{edu.degree} in {edu.field_of_study}</Text>
              <Text style={styles.content}>Graduated: {edu.graduation_date}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.subheading}>Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {data.skills.map((skill, i) => (
              <Text key={i} style={{ marginRight: 10, backgroundColor: '#ecf0f1', padding: 5, borderRadius: 5 }}>{skill.skill_name}</Text>
            ))}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default ModernTemplate;
