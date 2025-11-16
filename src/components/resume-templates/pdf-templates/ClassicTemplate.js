// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Font,
// } from "@react-pdf/renderer";

// // NOTE: React-PDF does not ship with the system Arial font by default in all environments.
// // If you need a byte-for-byte match to an Arial-rendered HTML, register an Arial font file with Font.register.
// // For visual parity this file uses "Helvetica" as the closest built-in match and sets sizes so the layout
// // matches the provided HTML (margins, gaps, headings, and month-year date formatting).

// // If you want me to register a specific TTF/OTF file (e.g. Arial.ttf) include the file and I will update the component.

// const styles = StyleSheet.create({
//   // page matches: @page { margin-top: 20px } and body { margin: 20px 50px }
//   page: {
//     // fontFamily: "Helvetica",
//     paddingTop: 29, // matches @page margin-top: 20px
//     paddingBottom: 20,
//     paddingLeft: 35,
//     paddingRight: 35,
//     color: "#000",
//     // React-PDF uses points. HTML px -> pt multiplier: 0.75
//     // We choose exact converted values so the visual sizes, gaps and flow match the HTML.
//     fontSize: 9, // base 12px -> 9pt
//   },

//   h1: {
//     // HTML: 22px -> 22 * 0.75 = 16.5pt
//     fontSize: 16.5,
//     fontWeight: 700,
//     margin: 0,
//   },

//   contact: {
//     // HTML: 11.5px -> 8.625pt
//     fontSize: 8.625,
//     marginTop: 5,
//   },

//   section: {
//     marginBottom: 20,
//   },

//   h2: {
//     // HTML: 14px -> 10.5pt
//     fontSize: 11,
//     fontWeight: 700,
//     textTransform: "uppercase",
//     marginTop: 15,
//     marginBottom: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: "#000",
//     paddingBottom: 3,
//   },

//   paragraph: {
//     // HTML: 12px -> 9pt
//     fontSize: 9,
//     lineHeight: 1.5,
//   },

//   position: {
//     // HTML: 12.5px -> 9.375pt
//     fontSize: 9.375,
//     fontWeight: 700,
//   },

//   companyDate: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 4,
//   },

//   date: {
//     // HTML: 10px -> 7.5pt
//     fontSize: 7.5,
//   },

//   ul: {
//     // HTML ul margins: margin: 5px 0 10px 20px;
//     marginTop: 5,
//     marginBottom: 10,
//     paddingLeft: 20,
//   },

//   li: {
//     marginBottom: 5,
//     fontSize: 9,
//     lineHeight: 1.5,
//   },

//   skillsText: {
//     // .skills font-size 12px -> 9pt
//     fontSize: 9,
//     marginTop: 5,
//   },

//   institution: {
//     fontSize: 9,
//   },

//   smallGap: {
//     marginTop: 8,
//   },

//   additionalList: {
//     marginTop: 5,
//     fontSize: 9,
//   },
// });

// // Format "YYYY-MM-DD" or "YYYY-MM" or "YYYY" -> "Mon YYYY" (e.g. "Jan 2023").
// function formatDate(dateStr) {
//   if (!dateStr) return "";
//   try {
//     // Accept strings like "2024-04-15", "2024-04" or "2024"
//     const parts = String(dateStr).trim().split("-");
//     const year = parts[0];
//     const month = parts[1] ? parseInt(parts[1], 10) : null;
//     if (!year) return "";
//     if (!month || isNaN(month)) return year;
//     const monthNames = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     return `${monthNames[month - 1]} ${year}`;
//   } catch (e) {
//     return dateStr;
//   }
// }

// function joinDateRange(start, end, isCurrent) {
//   const s = formatDate(start);
//   const e = isCurrent ? "Present" : formatDate(end);
//   if (s && e) return `${s} — ${e}`;
//   if (s) return s;
//   if (e) return e;
//   return "";
// }

// export default function ClassicTemplate({ resumeData = {} }) {
//   const profile = resumeData.profile || {};
//   const work = Array.isArray(resumeData.work_experience)
//     ? resumeData.work_experience
//     : [];
//   const education = Array.isArray(resumeData.education)
//     ? resumeData.education
//     : [];

//   // Support both [{ skill_name }] and simple string-array formats
//   const skillsArr = Array.isArray(resumeData.skills)
//     ? resumeData.skills
//     : resumeData.skills && Array.isArray(resumeData.skills.list_of_skills)
//     ? resumeData.skills.list_of_skills
//     : [];

//   const skillsText =
//     Array.isArray(skillsArr) && skillsArr.length > 0
//       ? skillsArr
//           .map((s) => (typeof s === "string" ? s : s.skill_name || ""))
//           .filter(Boolean)
//           .join(", ")
//       : resumeData.skills && typeof resumeData.skills === "string"
//       ? resumeData.skills
//       : "";

//   const languages =
//     (resumeData.additional_info && resumeData.additional_info.languages) || [];
//   const certifications =
//     (resumeData.additional_info && resumeData.additional_info.certifications) ||
//     [];
//   const awards =
//     (resumeData.additional_info &&
//       resumeData.additional_info.awards_activities) ||
//     [];

//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* Header */}
//         <View>
//           <Text style={styles.h1}>{profile.full_name || ""}</Text>
//           <Text style={styles.contact}>
//             {[profile.email, profile.phone, profile.location, profile.website]
//               .filter(Boolean)
//               .join(" | ")}
//           </Text>
//         </View>

//         {/* Summary */}
//         <View>
//           <Text style={styles.h2}>SUMMARY</Text>
//           <Text style={styles.paragraph}>{profile.generic_summary || ""}</Text>
//         </View>

//         {/* Professional Experience */}
//         <View style={styles.section}>
//           <Text style={styles.h2}>PROFESSIONAL EXPERIENCE</Text>

//           {work.map((exp, idx) => {
//             const title = exp.job_title || exp.position || exp.title || "";
//             const company = exp.company ? `${exp.company}` : "";
//             const start = exp.start_date || exp.start || exp.from;
//             const end = exp.end_date || exp.end || exp.to;
//             const isCurrent =
//               !!exp.is_current ||
//               !!exp.current ||
//               exp.end === null ||
//               exp.end === "";
//             const duration =
//               joinDateRange(start, end, isCurrent) || exp.duration || "";

//             const responsibilities =
//               Array.isArray(exp.responsibilities) &&
//               exp.responsibilities.length > 0
//                 ? exp.responsibilities
//                 : Array.isArray(exp.details)
//                 ? exp.details
//                 : Array.isArray(exp.bullets)
//                 ? exp.bullets
//                 : [];

//             return (
//               <View key={idx} style={styles.smallGap}>
//                 <View style={styles.companyDate}>
//                   <Text style={styles.position}>
//                     {title}
//                     {company ? `, ${company}` : ""}
//                   </Text>
//                   <Text style={styles.date}>{duration}</Text>
//                 </View>

//                 {responsibilities.length > 0 && (
//                   <View style={styles.ul}>
//                     {responsibilities.map((r, i) => (
//                       <Text key={i} style={styles.li}>
//                         {"\u2022"} {r}
//                       </Text>
//                     ))}
//                   </View>
//                 )}
//               </View>
//             );
//           })}
//         </View>

//         {/* Skills */}
//         <View style={styles.section}>
//           <Text style={styles.h2}>SKILLS</Text>
//           <Text style={styles.skillsText}>{skillsText}</Text>
//         </View>

//         {/* Education */}
//         <View style={styles.section}>
//           <Text style={styles.h2}>EDUCATION</Text>

//           {education.map((edu, i) => {
//             const degree = edu.degree || edu.qualification || "";
//             const field = edu.field_of_study ? ` in ${edu.field_of_study}` : "";
//             const start = edu.start_date || edu.start || edu.from;
//             const end = edu.end_date || edu.end || edu.to;
//             const duration =
//               joinDateRange(start, end, edu.is_current) || edu.duration || "";
//             const institution = edu.institution || edu.school || "";
//             const loc = edu.location ? `, ${edu.location}` : "";

//             return (
//               <View key={i} style={styles.smallGap}>
//                 <View style={styles.companyDate}>
//                   <Text style={styles.position}>
//                     {degree}
//                     {field}
//                   </Text>
//                   <Text style={styles.date}>{duration}</Text>
//                 </View>
//                 <Text style={styles.institution}>
//                   {institution}
//                   {loc}
//                 </Text>
//               </View>
//             );
//           })}
//         </View>

//         {/* Additional Info */}
//         {(languages.length > 0 ||
//           certifications.length > 0 ||
//           awards.length > 0) && (
//           <View style={styles.section}>
//             <Text style={styles.h2}>ADDITIONAL INFORMATION</Text>

//             {languages.length > 0 && (
//               <View style={styles.smallGap}>
//                 <Text style={styles.paragraph}>
//                   <Text style={{ fontWeight: 700 }}>Languages: </Text>
//                   {languages.join(", ")}
//                 </Text>
//               </View>
//             )}

//             {certifications.length > 0 && (
//               <View style={styles.smallGap}>
//                 <Text style={styles.paragraph}>
//                   <Text style={{ fontWeight: 700 }}>Certifications: </Text>
//                   {certifications.join(", ")}
//                 </Text>
//               </View>
//             )}

//             {awards.length > 0 && (
//               <View style={styles.smallGap}>
//                 <Text style={styles.paragraph}>
//                   <Text style={{ fontWeight: 700 }}>Projects / Awards: </Text>
//                   {awards.join(", ")}
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}
//       </Page>
//     </Document>
//   );
// }
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";

// NOTE: React-PDF does not ship with the system Arial font by default in all environments.
// If you need a byte-for-byte match to an Arial-rendered HTML, register an Arial font file with Font.register.
// For visual parity this file uses "Helvetica" as the closest built-in match and sets sizes so the layout
// matches the provided HTML (margins, gaps, headings, and month-year date formatting).

const styles = StyleSheet.create({
  page: {
    paddingTop: 29,
    paddingBottom: 20,
    paddingLeft: 35,
    paddingRight: 35,
    color: "#000",
    fontSize: 9,
  },

  h1: {
    fontSize: 16.5,
    fontWeight: 700,
    margin: 0,
  },

  contact: {
    fontSize: 8.625,
    marginTop: 5,
  },

  link: {
    color: "blue",
    textDecoration: "underline",
  },

  section: {
    marginBottom: 20,
  },

  h2: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    marginTop: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 3,
  },

  paragraph: {
    fontSize: 9,
    lineHeight: 1.5,
  },

  position: {
    fontSize: 9.375,
    fontWeight: 700,
  },

  companyDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  date: {
    fontSize: 7.5,
  },

  ul: {
    marginTop: 5,
    marginBottom: 10,
    paddingLeft: 20,
  },

  li: {
    marginBottom: 5,
    fontSize: 9,
    lineHeight: 1.5,
  },

  skillsText: {
    fontSize: 9,
    marginTop: 5,
  },

  institution: {
    fontSize: 9,
  },

  smallGap: {
    marginTop: 8,
  },

  additionalList: {
    marginTop: 5,
    fontSize: 9,
  },
});

// Format date
function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    const parts = String(dateStr).trim().split("-");
    const year = parts[0];
    const month = parts[1] ? parseInt(parts[1], 10) : null;
    if (!year) return "";
    if (!month || isNaN(month)) return year;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[month - 1]} ${year}`;
  } catch (e) {
    return dateStr;
  }
}

function joinDateRange(start, end, isCurrent) {
  const s = formatDate(start);
  const e = isCurrent ? "Present" : formatDate(end);
  if (s && e) return `${s} — ${e}`;
  if (s) return s;
  if (e) return e;
  return "";
}

export default function ClassicTemplate({ resumeData = {} }) {
  const profile = resumeData.profile || {};
  const work = Array.isArray(resumeData.work_experience)
    ? resumeData.work_experience
    : [];
  const education = Array.isArray(resumeData.education)
    ? resumeData.education
    : [];

  const skillsArr = Array.isArray(resumeData.skills)
    ? resumeData.skills
    : resumeData.skills && Array.isArray(resumeData.skills.list_of_skills)
    ? resumeData.skills.list_of_skills
    : [];

  const skillsText =
    Array.isArray(skillsArr) && skillsArr.length > 0
      ? skillsArr
          .map((s) => (typeof s === "string" ? s : s.skill_name || ""))
          .filter(Boolean)
          .join(", ")
      : resumeData.skills && typeof resumeData.skills === "string"
      ? resumeData.skills
      : "";

  const languages =
    (resumeData.additional_info && resumeData.additional_info.languages) || [];
  const certifications =
    (resumeData.additional_info && resumeData.additional_info.certifications) ||
    [];
  const awards =
    (resumeData.additional_info &&
      resumeData.additional_info.awards_activities) ||
    [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View>
          <Text style={styles.h1}>{profile.full_name || ""}</Text>

          {/* Contact info with blue website link */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text style={styles.contact}>
              {[profile.email, profile.phone, profile.location]
                .filter(Boolean)
                .join(" | ")}
            </Text>

            {profile.website && (
              <>
                <Text style={styles.contact}> | </Text>
                <Link
                  src={profile.website}
                  style={[styles.contact, styles.link]}
                >
                  {profile.website}
                </Link>
              </>
            )}
          </View>
        </View>

        {/* Summary */}
        <View>
          <Text style={styles.h2}>SUMMARY</Text>
          <Text style={styles.paragraph}>{profile.generic_summary || ""}</Text>
        </View>

        {/* Professional Experience */}
        <View style={styles.section}>
          <Text style={styles.h2}>PROFESSIONAL EXPERIENCE</Text>

          {work.map((exp, idx) => {
            const title = exp.job_title || exp.position || exp.title || "";
            const company = exp.company ? `${exp.company}` : "";
            const start = exp.start_date || exp.start || exp.from;
            const end = exp.end_date || exp.end || exp.to;
            const isCurrent =
              !!exp.is_current ||
              !!exp.current ||
              exp.end === null ||
              exp.end === "";
            const duration =
              joinDateRange(start, end, isCurrent) || exp.duration || "";
            const responsibilities =
              Array.isArray(exp.responsibilities) &&
              exp.responsibilities.length > 0
                ? exp.responsibilities
                : Array.isArray(exp.details)
                ? exp.details
                : Array.isArray(exp.bullets)
                ? exp.bullets
                : [];

            return (
              <View key={idx}>
                <View style={styles.companyDate}>
                  <Text style={styles.position}>
                    {title}
                    {company ? `, ${company}` : ""}
                  </Text>
                  <Text style={styles.date}>{duration}</Text>
                </View>

                {responsibilities.length > 0 && (
                  <View style={styles.ul}>
                    {responsibilities.map((r, i) => (
                      <Text key={i} style={styles.li}>
                        {"\u2022"} {r}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.h2}>SKILLS</Text>
          <Text style={styles.skillsText}>{skillsText}</Text>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.h2}>EDUCATION</Text>

          {education.map((edu, i) => {
            const degree = edu.degree || edu.qualification || "";
            const field = edu.field_of_study ? ` in ${edu.field_of_study}` : "";
            const start = edu.start_date || edu.start || edu.from;
            const end = edu.end_date || edu.end || edu.to;
            const duration =
              joinDateRange(start, end, edu.is_current) || edu.duration || "";
            const institution = edu.institution || edu.school || "";
            const loc = edu.location ? `, ${edu.location}` : "";

            return (
              <View key={i} style={styles.smallGap}>
                <View style={styles.companyDate}>
                  <Text style={styles.position}>
                    {degree}
                    {field}
                  </Text>
                  <Text style={styles.date}>{duration}</Text>
                </View>
                <Text style={styles.institution}>
                  {institution}
                  {loc}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Additional Info */}
        {(languages.length > 0 ||
          certifications.length > 0 ||
          awards.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.h2}>ADDITIONAL INFORMATION</Text>

            {languages.length > 0 && (
              <View style={styles.smallGap}>
                <Text style={styles.paragraph}>
                  <Text style={{ fontWeight: 700 }}>Languages: </Text>
                  {languages.join(", ")}
                </Text>
              </View>
            )}

            {certifications.length > 0 && (
              <View style={styles.smallGap}>
                <Text style={styles.paragraph}>
                  <Text style={{ fontWeight: 700 }}>Certifications: </Text>
                  {certifications.join(", ")}
                </Text>
              </View>
            )}

            {awards.length > 0 && (
              <View style={styles.smallGap}>
                <Text style={styles.paragraph}>
                  <Text style={{ fontWeight: 700 }}>Projects / Awards: </Text>
                  {awards.join(", ")}
                </Text>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}
