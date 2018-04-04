
const tagMap = {
  Anesthesia: ['anesthesia', 'anesthesiologist'],
  Cardiovascular: ['cardiovascular', 'cardiologist'],
  CommunityHealth: ['community'],
  Dentistry: ['dentistry', 'dentist', 'dental'],
  Dermatology: ['dermatologic', 'dermatologist', 'dermatology'],
  DietNutrition: ['diet', 'nutrition', 'nutritionist', 'dietologist', 'dietology'],
  Emergency: ['emergency'],
  Endocrine: ['endocrine', 'endocrinologist', 'endocrinology'],
  Gastroenterologic: ['gastroenterologic', 'gastroenterology', 'gastroenterologist'],
  Genetic: ['genetic', 'genetics'],
  Geriatric: ['geriatric', 'geriatrics'],
  Gynecologic: ['gynecologic', 'gynecology', 'gynecologist'],
  Hematologic: ['hematologic', 'hematology', 'hematologist'],
  Infectious: ['infectious', 'infection'],
  LaboratoryScience: ['lab', 'laboratory'],
  Midwifery: ['midwifery', 'midwife'],
  Musculoskeletal: ['musculoskeletal'],
  Neurologic: ['neurologic', 'neurology', 'neurologist'],
  Nursing: ['nursing', 'nurse'],
  Obstetric: ['obstetric', 'obstetrician', 'obstetrics'],
  OccupationalTherapy: ['occupational', 'occupation'],
  Oncologic: ['oncologic', 'oncological', 'oncological', 'oncologist'],
  Optometric: ['optometric', 'optometry', 'optometrist'],
  Otolaryngologic: ['otolaryngologic', 'otolaryngology', 'otolaryngologist'],
  Pathology: ['pathology', 'pathologist'],
  Pediatric: ['pediatric', 'pediatrician'],
  PharmacySpecialty: ['pharma', 'pharmacy', 'pharmacist'],
  Physiotherapy: ['physiotherapy', 'physiotherapist'],
  PlasticSurgery: ['plastic'],
  Podiatric: ['podiatric', 'podiatry', 'podiatrist'],
  PrimaryCare: ['primary'],
  Psychiatric: ['psychiatric', 'psychiatrist', 'psychiatry'],
  PublicHealth: ['public'],
  Pulmonary: ['pulmonary', 'pulmonology', 'respiratory', 'pulmonologist'],
  Radiography: ['radiography', 'radiographer'],
  Renal: ['renal', 'nephrology', 'nephrologist'],
  RespiratoryTherapy: ['respiration', 'respiratory'],
  Rheumatologic: ['rheumatology', 'rheumatologic', 'rheumatologist'],
  SpeechPathology: ['speech', 'language'],
  Surgical: ['surgical', 'surgeon', 'surgery'],
  Toxicologic: ['toxicologic', 'toxicological', 'toxicology', 'toxicologist'],
  Urologic: ['urologic', 'urology', 'urologist'],
};

export default function MedicalSpecialtyExtractor($, id, db) {
  return new Promise((resolve) => {
    const specialties = $(`.sg-title:contains('Specialties')`).parent().parent().find(`li`).map(function() {
      return $(this).text().trim();
    }).get();
    const nameSet = new Set();
    specialties.forEach((specialty) => {
      Object.keys(tagMap).forEach((tagKey) => {
        if (tagMap[tagKey].some((tag) => specialty.toLowerCase().includes(tag))) {
          nameSet.add(tagKey);
        }
      });
    });

    resolve(Array.from(nameSet).map(name => `schema:${name}`));
  });
}