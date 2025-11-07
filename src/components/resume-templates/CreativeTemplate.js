import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#4a4e69',
    padding: 30,
    color: '#ffffff',
    textAlign: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headline: {
    fontSize: 16,
    marginTop: 5,
  },
  body: {
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#22223b',
    borderBottom: '2px solid #9a8c98',
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
  skill: {
    backgroundColor: '#c9ada7',
    color: '#ffffff',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
});

const CreativeTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {/* You can add a profile image here if you have one */}
        {/* <Image style={styles.profileImage} src="..." /> */}
        <Text style={styles.name}>{data.profile.full_name}</Text>
        <Text style={styles.headline}>{data.profile.headline}</Text>
        <Text style={styles.content}>{data.profile.email}</Text>
      </View>
      <View style={styles.body}>
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
              <Text key={i} style={styles.skill}>{skill.skill_name}</Text>
            ))}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default CreativeTemplate;
