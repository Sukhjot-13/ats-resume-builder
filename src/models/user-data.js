const userData = {
  profile: {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    headline: "",
    generic_summary: "",
  },
  work_experience: [
    {
      job_title: "",
      company: "",
      start_date: "",
      end_date: "",
      is_current: false,
      responsibilities: [],
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      relevant_coursework: "",
    },
  ],
  skills: [],
  additional_info: {
    languages: [],
    certifications: [],
    awards_activities: [],
  },
};

export default userData;
