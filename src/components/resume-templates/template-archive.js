/*
This file is an archive of all the resume templates that were in the project.
*/

// From: src/components/resume-templates/AdviceWithErin1.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles_AdviceWithErin1 = StyleSheet.create({
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
    <Page size="A4" style={styles_AdviceWithErin1.page}>
      <View style={styles_AdviceWithErin1.header}>
        <Text style={styles_AdviceWithErin1.name}>{data.profile.full_name}</Text>
        <Text style={styles_AdviceWithErin1.headline}>{data.profile.headline}</Text>
        <Text style={styles_AdviceWithErin1.contactInfo}>{data.profile.email}</Text>
      </View>

      <View style={styles_AdviceWithErin1.section}>
        <Text style={styles_AdviceWithErin1.subheading}>Summary</Text>
        <Text style={styles_AdviceWithErin1.content}>{data.profile.generic_summary}</Text>
      </View>

      <View style={styles_AdviceWithErin1.section}>
        <Text style={styles_AdviceWithErin1.subheading}>Work Experience</Text>
        {data.work_experience.map((exp, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <Text style={{...styles_AdviceWithErin1.content, fontWeight: 'bold'}}>{exp.job_title} at {exp.company}</Text>
            <Text style={styles_AdviceWithErin1.content}>{exp.start_date} - {exp.end_date}</Text>
            {exp.responsibilities.map((resp, j) => (
              <Text key={j} style={styles_AdviceWithErin1.listItem}>- {resp}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles_AdviceWithErin1.section}>
        <Text style={styles_AdviceWithErin1.subheading}>Education</Text>
        {data.education.map((edu, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <Text style={{...styles_AdviceWithErin1.content, fontWeight: 'bold'}}>{edu.institution}</Text>
            <Text style={styles_AdviceWithErin1.content}>{edu.degree} in {edu.field_of_study}</Text>
            <Text style={styles_AdviceWithErin1.content}>Graduated: {edu.graduation_date}</Text>
          </View>
        ))}
      </View>

      <View style={styles_AdviceWithErin1.section}>
        <Text style={styles_AdviceWithErin1.subheading}>Skills</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {data.skills.map((skill, i) => (
            <Text key={i} style={{ marginRight: 10 }}>{skill.skill_name}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);


// From: src/components/resume-templates/AdviceWithErin2.js
const styles_AdviceWithErin2 = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  leftColumn: {
    flexDirection: 'column',
    width: '35%',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  rightColumn: {
    flexDirection: 'column',
    width: '65%',
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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

const AdviceWithErin2 = ({ data }) => (
  <Document>
    <Page size="A4" style={styles_AdviceWithErin2.page}>
      <View style={styles_AdviceWithErin2.leftColumn}>
        <Text style={styles_AdviceWithErin2.name}>{data.profile.full_name}</Text>
        <Text style={styles_AdviceWithErin2.content}>{data.profile.headline}</Text>
        <Text style={styles_AdviceWithErin2.content}>{data.profile.email}</Text>

        <View style={styles_AdviceWithErin2.section}>
          <Text style={styles_AdviceWithErin2.subheading}>Skills</Text>
          {data.skills.map((skill, i) => (
            <Text key={i} style={styles_AdviceWithErin2.listItem}>{skill.skill_name}</Text>
          ))}
        </View>
      </View>
      <View style={styles_AdviceWithErin2.rightColumn}>
        <View style={styles_AdviceWithErin2.section}>
          <Text style={styles_AdviceWithErin2.subheading}>Summary</Text>
          <Text style={styles_AdviceWithErin2.content}>{data.profile.generic_summary}</Text>
        </View>

        <View style={styles_AdviceWithErin2.section}>
          <Text style={styles_AdviceWithErin2.subheading}>Work Experience</Text>
          {data.work_experience.map((exp, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{...styles_AdviceWithErin2.content, fontWeight: 'bold'}}>{exp.job_title} at {exp.company}</Text>
              <Text style={styles_AdviceWithErin2.content}>{exp.start_date} - {exp.end_date}</Text>
              {exp.responsibilities.map((resp, j) => (
                <Text key={j} style={styles_AdviceWithErin2.listItem}>- {resp}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles_AdviceWithErin2.section}>
          <Text style={styles_AdviceWithErin2.subheading}>Education</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{...styles_AdviceWithErin2.content, fontWeight: 'bold'}}>{edu.institution}</Text>
              <Text style={styles_AdviceWithErin2.content}>{edu.degree} in {edu.field_of_study}</Text>
              <Text style={styles_AdviceWithErin2.content}>Graduated: {edu.graduation_date}</Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);


// From: src/components/resume-templates/ClassicTemplate.js
const styles_ClassicTemplate = StyleSheet.create({
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
    <Page size="A4" style={styles_ClassicTemplate.page}>
      <View style={styles_ClassicTemplate.section}>
        <Text style={styles_ClassicTemplate.heading}>{data.profile.full_name}</Text>
        <Text style={styles_ClassicTemplate.content}>{data.profile.email}</Text>
        <Text style={styles_ClassicTemplate.content}>{data.profile.headline}</Text>
        <Text style={styles_ClassicTemplate.content}>{data.profile.generic_summary}</Text>
      </View>

      <View style={styles_ClassicTemplate.section}>
        <Text style={styles_ClassicTemplate.subheading}>Work Experience</Text>
        {data.work_experience.map((exp) => (
          <View key={exp.id} style={styles_ClassicTemplate.section}>
            <Text style={styles_ClassicTemplate.content}>{exp.job_title} at {exp.company}</Text>
            <Text style={styles_ClassicTemplate.content}>{exp.start_date} - {exp.end_date}</Text>
            {exp.responsibilities.map((resp, i) => (
              <Text key={i} style={styles_ClassicTemplate.listItem}>- {resp}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles_ClassicTemplate.section}>
        <Text style={styles_ClassicTemplate.subheading}>Education</Text>
        {data.education.map((edu) => (
          <View key={edu.id} style={styles_ClassicTemplate.section}>
            <Text style={styles_ClassicTemplate.content}>{edu.institution}</Text>
            <Text style={styles_ClassicTemplate.content}>{edu.degree} in {edu.field_of_study}</Text>
            <Text style={styles_ClassicTemplate.content}>Graduated: {edu.graduation_date}</Text>
          </View>
        ))}
      </View>

      <View style={styles_ClassicTemplate.section}>
        <Text style={styles_ClassicTemplate.subheading}>Skills</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {data.skills.map((skill) => (
            <Text key={skill.id} style={{ marginRight: 10 }}>{skill.skill_name}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);


// From: src/components/resume-templates/CreativeTemplate.js
const styles_CreativeTemplate = StyleSheet.create({
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
    <Page size="A4" style={styles_CreativeTemplate.page}>
      <View style={styles_CreativeTemplate.header}>
        {/* You can add a profile image here if you have one */}
        {/* <Image style={styles_CreativeTemplate.profileImage} src="..." /> */}
        <Text style={styles_CreativeTemplate.name}>{data.profile.full_name}</Text>
        <Text style={styles_CreativeTemplate.headline}>{data.profile.headline}</Text>
        <Text style={styles_CreativeTemplate.content}>{data.profile.email}</Text>
      </View>
      <View style={styles_CreativeTemplate.body}>
        <View style={styles_CreativeTemplate.section}>
          <Text style={styles_CreativeTemplate.subheading}>Summary</Text>
          <Text style={styles_CreativeTemplate.content}>{data.profile.generic_summary}</Text>
        </View>

        <View style={styles_CreativeTemplate.section}>
          <Text style={styles_CreativeTemplate.subheading}>Work Experience</Text>
          {data.work_experience.map((exp, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{...styles_CreativeTemplate.content, fontWeight: 'bold'}}>{exp.job_title} at {exp.company}</Text>
              <Text style={styles_CreativeTemplate.content}>{exp.start_date} - {exp.end_date}</Text>
              {exp.responsibilities.map((resp, j) => (
                <Text key={j} style={styles_CreativeTemplate.listItem}>- {resp}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles_CreativeTemplate.section}>
          <Text style={styles_CreativeTemplate.subheading}>Education</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{...styles_CreativeTemplate.content, fontWeight: 'bold'}}>{edu.institution}</Text>
              <Text style={styles_CreativeTemplate.content}>{edu.degree} in {edu.field_of_study}</Text>
              <Text style={styles_CreativeTemplate.content}>Graduated: {edu.graduation_date}</Text>
            </View>
          ))}
        </View>

        <View style={styles_CreativeTemplate.section}>
          <Text style={styles_CreativeTemplate.subheading}>Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {data.skills.map((skill, i) => (
              <Text key={i} style={styles_CreativeTemplate.skill}>{skill.skill_name}</Text>
            ))}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);


// From: src/components/resume-templates/ModernTemplate.js
const styles_ModernTemplate = StyleSheet.create({
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
    <Page size="A4" style={styles_ModernTemplate.page}>
      <View style={styles_ModernTemplate.leftColumn}>
        <Text style={styles_ModernTemplate.heading}>{data.profile.full_name}</Text>
        <Text style={styles_ModernTemplate.content}>{data.profile.email}</Text>
        <Text style={styles_ModernTemplate.content}>{data.profile.headline}</Text>
      </View>
      <View style={styles_ModernTemplate.rightColumn}>
        <View style={styles_ModernTemplate.section}>
          <Text style={styles_ModernTemplate.subheading}>Summary</Text>
          <Text style={styles_ModernTemplate.content}>{data.profile.generic_summary}</Text>
        </View>

        <View style={styles_ModernTemplate.section}>
          <Text style={styles_ModernTemplate.subheading}>Work Experience</Text>
          {data.work_experience.map((exp, i) => (
            <View key={i} style={styles_ModernTemplate.section}>
              <Text style={{...styles_ModernTemplate.content, fontWeight: 'bold'}}>{exp.job_title} at {exp.company}</Text>
              <Text style={styles_ModernTemplate.content}>{exp.start_date} - {exp.end_date}</Text>
              {exp.responsibilities.map((resp, j) => (
                <Text key={j} style={styles_ModernTemplate.listItem}>- {resp}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles_ModernTemplate.section}>
          <Text style={styles_ModernTemplate.subheading}>Education</Text>
          {data.education.map((edu, i) => (
            <View key={i} style={styles_ModernTemplate.section}>
              <Text style={{...styles_ModernTemplate.content, fontWeight: 'bold'}}>{edu.institution}</Text>
              <Text style={styles_ModernTemplate.content}>{edu.degree} in {edu.field_of_study}</Text>
              <Text style={styles_ModernTemplate.content}>Graduated: {edu.graduation_date}</Text>
            </View>
          ))}
        </View>

        <View style={styles_ModernTemplate.section}>
          <Text style={styles_ModernTemplate.subheading}>Skills</Text>
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


// From: src/components/resume-templates/tailwind-templates/TailwindModern.js
const TailwindModern = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const { profile, work_experience, education, skills } = data;

  return (
    <div className="font-['Arial,_Helvetica,_sans-serif'] p-[40px] px-[60px] text-black">
      <div className="mb-4">
        <h1 className="text-[22px] font-bold m-0">{profile.full_name}</h1>
        <p className="text-xs leading-normal">{profile.headline}</p>
        <p className="text-[11.5px] mt-1">
          {profile.email} | {profile.phone || '123-456-7890'} | {profile.location || 'City, STATE'} | {profile.website || 'www.website.com'}
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-sm font-bold uppercase mt-6 border-b border-black pb-1 mb-1">
          Summary
        </h2>
        <p className="text-xs leading-normal my-1">{profile.generic_summary}</p>
      </div>

      <div className="mb-5">
        <h2 className="text-sm font-bold uppercase mt-6 border-b border-black pb-1 mb-1">
          Professional Experience
        </h2>
        {work_experience && work_experience.map((exp, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-center">
              <div className="font-bold text-[12.5px]">
                {exp.job_title}, {exp.company}
              </div>
              <div>
                <em className="text-xs leading-normal">
                  {exp.start_date} - {exp.end_date}
                </em>
              </div>
            </div>
            <ul className="my-1 ml-5 list-disc">
              {exp.responsibilities && exp.responsibilities.map((resp, j) => (
                <li key={j} className="text-xs leading-normal mb-1">
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-5">
        <h2 className="text-sm font-bold uppercase mt-6 border-b border-black pb-1 mb-1">
          Skills
        </h2>
        <p className="text-xs leading-normal mt-1">
          {skills && skills.map(skill => skill.skill_name).join(', ')}
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-sm font-bold uppercase mt-6 border-b border-black pb-1 mb-1">
          Education
        </h2>
        {education && education.map((edu, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold">
                  {edu.degree}, {edu.field_of_study}
                </span>
              </div>
              <div>
                <em className="text-xs leading-normal">
                  {edu.graduation_date}
                </em>
              </div>
            </div>
            <p className="text-xs leading-normal my-1">{edu.institution}</p>
            <ul className="mt-1 ml-5 list-disc">
              <li className="text-xs leading-normal mb-1">Relevant coursework, study abroad, awards</li>
            </ul>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-bold uppercase mt-6 border-b border-black pb-1 mb-1">
          Additional Information
        </h2>
        <ul className="mt-1 ml-5 list-disc">
          <li className="text-xs leading-normal mb-1">
            <span className="font-bold">Languages:</span> English, Spanish (fluent)
          </li>
          <li className="text-xs leading-normal mb-1">
            <span className="font-bold">Certifications:</span> Online Certification, Course Completion, Registration, License, etc.
          </li>
          <li className="text-xs leading-normal mb-1">
            <span className="font-bold">Awards/Activities:</span> Best Person of the Year (2020), Award of the Awards (2020), Top 50 Best Award Winners (2020), Student of the Year (2020)
          </li>
        </ul>
      </div>
    </div>
  );
};
