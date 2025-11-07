import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headline: {
    fontSize: 14,
    marginTop: 5,
  },
  contactInfo: {
    fontSize: 10,
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1px solid #000000',
    paddingBottom: 5,
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

const AdviceWithErin1 = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.profile.full_name}</Text>
        <Text style={styles.headline}>{data.profile.headline}</Text>
        <Text style={styles.contactInfo}>{data.profile.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Summary</Text>
        <Text style={styles.content}>{data.profile.generic_summary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>Work Experience</Text>
        {data.work_experience.map((exp, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
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
          <View key={i} style={{ marginBottom: 10 }}>
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
            <Text key={i} style={{ marginRight: 10 }}>{skill.skill_name}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default AdviceWithErin1;
