import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const Creative = ({ resumeData }) => {
  console.log('resumeData in Creative template:', resumeData);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Creative Template</Text>
          {resumeData && resumeData.profile && <Text>{resumeData.profile.full_name}</Text>}
        </View>
      </Page>
    </Document>
  );
};

export default Creative;
