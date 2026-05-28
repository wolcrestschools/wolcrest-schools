import { ClassData, StudentRecord } from './types';

export const SCHOOL_MANIFESTO = {
  mission: "To cultivate a state-of-the-art scholastic environment where rigorous, world-class academic discipline meets creative innovation, empowering students of today to lead globally with self-knowledge, dignity, and intellectual power.",
  vision: "To stand as West Africa's premium beacon of k-12 academic excellence, nurturing visionary leaders, scientists, artists, and entrepreneurs whose high character and mastery of knowledge will create a secure, prosperous global future.",
  motto: "Wolcrest, where the future is assured",
  aboutUsDescription: "Founded over a decade ago, Wolcrest Schools began with a singular vision: to blend West African educational rigor with global technological capabilities. From our foundational kindergarten classrooms to our senior secondary college prep programs, we cultivate critical thinking, creative expression, and technical proficiency. We are renowned for our elite science laboratories, creative arts spaces, responsive computer science curricula, and our custom-engineered AI tutoring advisor with Gemini integration.",
  coreValues: [
    { title: "Intellectual Rigor", desc: "Mastery of essential core subject theories, critical analysis, and mathematical accuracy." },
    { title: "Civic Integrity", desc: "A strong code of honor, community values, and active civic responsibility in West Africa and beyond." },
    { title: "Creative Synergy", desc: "Expressing original ideas through visual arts, literature, and innovative programming." },
    { title: "Assured Future", desc: "Systematic preparation for university studies, SSCE/WAEC exam brilliance, and global career pathways." }
  ],
  academicCalendar: {
    term: "2026/2027 Academic Session - 3rd Term",
    events: [
      { date: "June 2, 2026", title: "Mid-Term Academic Progress Assessments" },
      { date: "June 15, 2026", title: "Wolcrest STEM & Arts Exhibition Showcase" },
      { date: "July 8-16, 2026", title: "WAEC Mock Examination Exercises" },
      { date: "July 24, 2026", title: "End of Term Examinations & Visual Arts Gala" }
    ]
  }
};

export const OFF_CLASSES_DATA: Record<string, ClassData> = {
  'Kindergarten': {
    name: 'Kindergarten (Ages 3-5)',
    subjects: [
      { name: 'Emergent Literacy', code: 'KG-LIT', description: 'Phonological awareness, letter-sound identification, and letter formation trace work.' },
      { name: 'Numeracy Play', code: 'KG-NUM', description: 'Interactive counting scales, primary sorting matrices, shapes, and active size sorting.' },
      { name: 'Sensory Science & Nature', code: 'KG-SCI', description: 'Investigating weather patterns, seed growth, clean water cycles, and basic hygiene.' },
      { name: 'Creative Expression & Arts', code: 'KG-ART', description: 'Hands-on molding, visual fingerpainting, finger coordination, and nursery song rhythms.' },
      { name: 'Social Manners & Graces', code: 'KG-SOC', description: 'Active sharing, clean table manners, courtesy vocabulary, and emotion regulation.' },
      { name: 'Yoruba Language & Culture', code: 'KG-YOR', description: 'Introduction to Yoruba greeting traditions, simple words, and cultural rhymes.' },
      { name: 'Civic Education & Values', code: 'KG-CIV', description: 'Learning community values, mutual respect, national symbols, and simple courtesy.' }
    ]
  },
  'Nursery 1': {
    name: 'Nursery 1',
    subjects: [
      { name: 'Phonetics & Vocabulary', code: 'NR1-PHO', description: 'Two-letter word blend sounds, sight reading basic nouns, and name writing circles.' },
      { name: 'Basic Number Bonds', code: 'NR1-NUM', description: 'Mastery of numerals 1 to 50, basic quantity recognition, and simple pattern chains.' },
      { name: 'Colour & Geometry', code: 'NR1-GEO', description: 'Primary and secondary colour blending, identifying basic polygons, and spatial orientation.' },
      { name: 'Environmental Care', code: 'NR1-ENV', description: 'Planting seeds, clean play environments, understanding animals, and recycling concepts.' },
      { name: 'Yoruba Language', code: 'NR1-YOR', description: 'Basic Yoruba words, tone sounds, household names, and cultural greetings.' },
      { name: 'Civic Education', code: 'NR1-CIV', description: 'Foundations of obedience, school rules, greeting elders, and helper roles.' }
    ]
  },
  'Nursery 2': {
    name: 'Nursery 2',
    subjects: [
      { name: 'Literacy & Story Reading', code: 'NR2-LIT', description: 'Simple reading of three-letter phonetic stories, spelling tests, and picture description paragraphs.' },
      { name: 'Addition & Subtraction Foundations', code: 'NR2-ARI', description: 'Single-digit arithmetic operations, mental sums 1-10, and count-back concepts.' },
      { name: 'Discovery of Nature', code: 'NR2-NAT', description: 'Mammalian characteristics, plant leaf categories, and hot or cold thermal sensations.' },
      { name: 'Civic Virtues & Community', code: 'NR2-CIV', description: 'National symbols identification, community helpers (doctors, police, teachers), and traffic rules.' },
      { name: 'Yoruba Language', code: 'NR2-YOR', description: 'Simple Yoruba vocabulary, writing short letters, cultural stories, and greeting ethics.' }
    ]
  },
  'Primary 1': {
    name: 'Primary 1',
    subjects: [
      { name: 'Primary Mathematics', code: 'PR1-MTH', description: 'Decimal place values, double digit additions, times tables 2x-5x, and basic clock reading.' },
      { name: 'English Grammar & Spelling', code: 'PR1-ENG', description: 'Nouns, verbs, basic punctuation (period, capital letters), and weekly spelling bees.' },
      { name: 'Basic General Science', code: 'PR1-SCI', description: 'Living vs non-living classifications, water attributes, source and senses organs.' },
      { name: 'Social Studies & Citizenship', code: 'PR1-SOC', description: 'Family safety values, respect for elders, culture identity, and basic sanitation.' },
      { name: 'Computer Appreciation', code: 'PR1-CSC', description: 'Identifying main computer components: monitor, mouse, keyboard, and clean computer lab rules.' },
      { name: 'Yoruba Language', code: 'PR1-YOR', description: 'Ami ohun (tone mark symbol rules), naming domestic objects, and family tree terms.' },
      { name: 'Civic Education', code: 'PR1-CIV', description: 'National values, community security rules, traffic safety indicators, and respect guidelines.' }
    ]
  },
  'Primary 2': {
    name: 'Primary 2',
    subjects: [
      { name: 'Primary Mathematics', code: 'PR2-MTH', description: 'Multiplication arithmetic, simple fractions division, geometry shapes, and money unit exchanges.' },
      { name: 'English Studies', code: 'PR2-ENG', description: 'Adjectives, adverbs, reading simple comprehensions, narrative story paragraphs, and reading comprehension.' },
      { name: 'General Science', code: 'PR2-SCI', description: 'Plant growth elements, human senses anatomy, properties of air, and introduction to energy sources.' },
      { name: 'Social Studies', code: 'PR2-SOC', description: 'Traffic regulations, local geography, neighborhood history, and communal hygiene.' },
      { name: 'Basic Computing', code: 'PR2-CSC', description: 'Foundations of booting computers, mouse pointer operations, and educational painting software modules.' },
      { name: 'Yoruba Language', code: 'PR2-YOR', description: 'Spelling short objects, reciting numbers, telling traditional folklore tales, and greeting ethics.' },
      { name: 'Civic Education', code: 'PR2-CIV', description: 'Understanding authority figures, benefits of discipline, cleanliness, and road usage signs.' }
    ]
  },
  'Primary 3': {
    name: 'Primary 3',
    subjects: [
      { name: 'Quantitative Reasoning', code: 'PR3-QNT', description: 'Challenging mental mathematics math drills, geometric patterns, and deductive numerical puzzles.' },
      { name: 'Verbal Aptitude', code: 'PR3-VRB', description: 'Vocabulary building, word classifications, identifying synonyms, and spelling matrices.' },
      { name: 'English Studies', code: 'PR3-ENG', description: 'Pronouns, conjunctions, informal letter writing format, and vocal oral pronunciation drills.' },
      { name: 'Primary Mathematics', code: 'PR3-MTH', description: 'Introduction to word problems, division with remainders, perimeters of rectangles, and data tallying.' },
      { name: 'Basic Science & Tech', code: 'PR3-SCI', description: 'The solar system overview, force and friction, water safety filters, and animal habitats.' },
      { name: 'Yoruba Language', code: 'PR3-YOR', description: 'Consonants/Vowels (Konsonanti ati Fafeli), traditional occupations, greeting categories.' },
      { name: 'Civic Education', code: 'PR3-CIV', description: 'Qualities of good leadership, roles of government, human rights declaration, and community responsibilities.' }
    ]
  },
  'Primary 4': {
    name: 'Primary 4',
    subjects: [
      { name: 'Quantitative Reasoning', code: 'PR4-QNT', description: 'Multi-layer numerical puzzles, fraction ratios, pattern analysis, and fast arithmetic computations.' },
      { name: 'Verbal Aptitude', code: 'PR4-VRB', description: 'Analogy comparisons, active word grouping, homophones, and antonym exercises.' },
      { name: 'English Language', code: 'PR4-ENG', description: 'Active vs passive voice, basic conjunction compound sentences, formal letter formats, and spelling stories.' },
      { name: 'Primary Mathematics', code: 'PR4-MTH', description: 'Equivalent fractions, angles measurements, area formulas, long division algorithms, and bar charts.' },
      { name: 'Basic Science', code: 'PR4-SCI', description: 'Skeletal frameworks of animals, properties of soils, floating vs sinking mechanics, and simple machines.' },
      { name: 'Yoruba Language', code: 'PR4-YOR', description: 'Yoruba essays structure (Akoopo Aroko), proverbs (Owe), food values, and traditional clothing.' },
      { name: 'Civic Education', code: 'PR4-CIV', description: 'Constitutional governance, values of honesty/loyalty, national anthem history, and road safety regulations.' }
    ]
  },
  'Primary 5': {
    name: 'Primary 5',
    subjects: [
      { name: 'Advanced Quantitative Reasoning', code: 'PR5-QNT', description: 'Complex arithmetic operations logic, percentage sequences, algebraic diagrams, and numeric codes.' },
      { name: 'Advanced Verbal Aptitude', code: 'PR5-VRB', description: 'Sentence ordering, prefix and suffix derivations, double analogy sets, and advanced syntax.' },
      { name: 'Grammar & Composition', code: 'PR5-ENG', description: 'Descriptive and formal expository compositions, direct and indirect speech reporting, and complex sentence syntax.' },
      { name: 'Primary Mathematics', code: 'PR5-MTH', description: 'Ratios, speed, time and distance equations, decimals multiplications, and 3D shapes surface area calculations.' },
      { name: 'Computer Coding Principles', code: 'PR5-CSC', description: 'Introduction to sequential algorithms, logic flowcharts, visual block programming, and internet safety.' },
      { name: 'Yoruba Language', code: 'PR5-YOR', description: 'Parts of speech (Ayawo Gbolohun), history of Yoruba sub-groups, state structure, and literal summaries.' },
      { name: 'Civic Education', code: 'PR5-CIV', description: 'Federal state structures, tier level powers, citizen human rights, rules of clean public sanitation.' }
    ]
  },
  'Primary 6': {
    name: 'Primary 6',
    subjects: [
      { name: 'Common Entrance Prep Math', code: 'PR6-MTH', description: 'Intensive common entrance mathematics drills, statistics percentages, compound interest, and advanced plane geometry.' },
      { name: 'Critical Reading & Essay', code: 'PR6-ENG', description: 'Writing under timing pressure, high score band vocabulary vocabulary selection, and comprehension summary skills.' },
      { name: 'Basic Science & Tech Prep', code: 'PR6-SCI', description: 'Electrical energy properties, human respiratory anatomy, carbon oxygen cycles, and metal chemical properties.' },
      { name: 'Civics & Leadership', code: 'PR6-CIV', description: 'Democratic institutions, human rights declarations, national integration, and global cooperation.' },
      { name: 'Computer Coding', code: 'PR6-CSC', description: 'Intermediate web searching, compiling Scratch algorithms, simple databases, and document processing.' },
      { name: 'Yoruba Language', code: 'PR6-YOR', description: 'Akoto spelling, mock examination composition drafting, and advanced oral proverbs.' }
    ]
  },
  'JSS 1': {
    name: 'Junior Secondary 1 (JSS 1)',
    subjects: [
      { name: 'Basic Mathematics', code: 'JSS1-MTH', description: 'Prime numbers, LCM, HCF, simple algebra ratios, shapes coordinates, area conversions, and statistics.' },
      { name: 'English Studies', code: 'JSS1-ENG', description: 'Parts of speech, narrative composition paragraphs, reading comprehension, and phonetics sounds.' },
      { name: 'Basic Science', code: 'JSS1-SCI', description: 'Scientific methods, characteristics of matter, mammal skeletal joints, and potential energy cycles.' },
      { name: 'Social Studies', code: 'JSS1-SOC', description: 'Social values, domestic family roles, transport safety regulations, and cultural diversity.' },
      { name: 'Yoruba Language', code: 'JSS1-YOR', description: 'Yoruba tone symbols (ami ohun), simple spellings, oral readings, and greeting ethics.' },
      { name: 'Civic Education', code: 'JSS1-CIV', description: 'National values, community security rules, citizenship rights, and democratic principles.' },
      { name: 'Agricultural Science', code: 'JSS1-AGR', description: 'Introduction to agriculture, crop types, domestic animals, and farming tools.' },
      { name: 'Cultural and Creative Arts (CCA)', code: 'JSS1-CCA', description: 'Introduction to arts, drawing fundamentals, music notes, and local cultural dramas.' },
      { name: 'Christian Religious Studies (CRS)', code: 'JSS1-CRS', description: 'Creation stories, lives of early patriarchs, faith lessons, and moral community behaviors.' },
      { name: 'Home Economics', code: 'JSS1-HEC', description: 'Basic home safety guidelines, human physical change stages, and needlework foundations.' }
    ]
  },
  'JSS 2': {
    name: 'Junior Secondary 2 (JSS 2)',
    subjects: [
      { name: 'Basic Mathematics', code: 'JSS2-MTH', description: 'Simple indices, binary calculations, expansions, algebraic factorization, and linear inequalities.' },
      { name: 'English Studies', code: 'JSS2-ENG', description: 'Verb tenses, active/passive voice transformation, informal correspondence formats, and oral stress.' },
      { name: 'Basic Science', code: 'JSS2-SCI', description: 'Mammalian respiration, mammal digestions, energy transformations, and ecosystem dynamics.' },
      { name: 'Social Studies', code: 'JSS2-SOC', description: 'Leadership models, human rights protections, combatting substance/drug abuse, and safety measures.' },
      { name: 'Yoruba Language', code: 'JSS2-YOR', description: 'Tone marks recognition, sentence structuring, folklore definitions, and traditional outfits.' },
      { name: 'Civic Education', code: 'JSS2-CIV', description: 'Attributes of discipline, integrity values, national identity symbols, and constitution facts.' },
      { name: 'Agricultural Science', code: 'JSS2-AGR', description: 'Tillage practices, soil organic matter, crop propagation, and weed/pest control.' },
      { name: 'Cultural and Creative Arts (CCA)', code: 'JSS2-CCA', description: 'Three-dimensional arts, clay molding, traditional folk songs, and dance theatre motifs.' },
      { name: 'Christian Religious Studies (CRS)', code: 'JSS2-CRS', description: 'The Ten Commandments, Moses leadership style, loyalty, and Christian moral choices.' },
      { name: 'Home Economics', code: 'JSS2-HEC', description: 'Nutritious meal plans, dynamic food safety codes, personal hygiene habits, and sewing stitches.' }
    ]
  },
  'JSS 3': {
    name: 'Junior Secondary 3 (JSS 3)',
    subjects: [
      { name: 'Basic Mathematics', code: 'JSS3-MTH', description: 'Quadratic expressions factoring, cones, cylinders and spheres volumes, linear equations, and simple probability.' },
      { name: 'English Studies', code: 'JSS3-ENG', description: 'Conjunction syntax, formal writing frameworks, argumentative speech writing, and oral sound contrasts.' },
      { name: 'Basic Science', code: 'JSS3-SCI', description: 'Ohm\'s law, electromagnetism, basic hydrocarbons compounds, electronic diodes, and simple pulleys/machines.' },
      { name: 'Social Studies', code: 'JSS3-SOC', description: 'Social problems, peer pressure challenges, dynamic globalization effects, and conflict resolutions.' },
      { name: 'Yoruba Language', code: 'JSS3-YOR', description: 'Yoruba essays composition, complex tone transformations, literature plays, and traditional marriage values.' },
      { name: 'Civic Education', code: 'JSS3-CIV', description: 'Separation of powers (judiciary, legislature, executive), traditional integration, and peace conflict resolutions.' },
      { name: 'Agricultural Science', code: 'JSS3-AGR', description: 'Livestock management standards, farm accounting practices, animal feeds, and commercial farm setups.' },
      { name: 'Cultural and Creative Arts (CCA)', code: 'JSS3-CCA', description: 'Graphic design principles, modern craft designs, theater acting roles, and music orchestration.' },
      { name: 'Christian Religious Studies (CRS)', code: 'JSS3-CRS', description: 'Sermon on the Mount lessons, parables of Jesus, early apostles acts, and spiritual values.' },
      { name: 'Home Economics', code: 'JSS3-HEC', description: 'Household management budgets, laundry practices, sewing patterns, and culinary preparation guides.' }
    ]
  },
  'SSS 1': {
    name: 'Senior Secondary 1 (SSS 1)',
    isSenior: true,
    departments: {
      'Sciences (STEM)': [
        { name: 'Core Mathematics', code: 'SS1-MTH', description: 'Indices expansions, quadratic equations, surds rationalization, and logarithm rules.' },
        { name: 'Further Mathematics', code: 'SS1-FMT', description: 'Set theory, binary operations, polynomials, mapping systems, and coordinate vectors.' },
        { name: 'Physics', code: 'SS1-PHY', description: 'Fundamental metrics, motion mechanics, frictional indices, and absolute temperatures.' },
        { name: 'Chemistry', code: 'SS1-CHM', description: 'Atomic electron shells, modern periodic table groups, ideal gas equations, and mixture separations.' },
        { name: 'Biology', code: 'SS1-BIO', description: 'Plant vs animal cellular structures, soil nutrients transport, vertebrae, and mammalian skeletal structure.' },
        { name: 'Economics', code: 'SS1-ECO', description: 'Basic microeconomics: demand & supply laws, utility factors, human needs vs resources, and price indices.' },
        { name: 'English Language', code: 'SS1-ENG', description: 'Narrative composition timing, reported speech transformations, summaries writing, and oral dipthongs.' },
        { name: 'Yoruba Language', code: 'SS1-YOR', description: 'Tone marks, letters orthography, cultural heritage values, and simple translations.' },
        { name: 'Civic Education', code: 'SS1-CIV', description: 'National values, civic responsibilities, traffic safety codes, and community ethics.' }
      ],
      'Arts & Humanities': [
        { name: 'English Language', code: 'SS1-ENG', description: 'Grammar modifiers, reports, reading summaries, comprehension paragraphs, and phonetic accents.' },
        { name: 'Literature-in-English', code: 'SS1-LIT', description: 'Reading WAEC prescribed African drama, non-African poetry meters, and prose literary devices.' },
        { name: 'Government', code: 'SS1-GOV', description: 'Characteristics of statehood, sovereignty types, constitution forms, and franchise options.' },
        { name: 'History', code: 'SS1-HIS', description: 'Pre-colonial West African kingdoms history, trans-Saharan trade impacts, and early settlements.' },
        { name: 'Christian/Islamic Religious Studies', code: 'SS1-REL', description: 'Religious ethics, scriptural evaluations, historical narratives, and standard spiritual morality.' },
        { name: 'Further Mathematics', code: 'SS1-FMT', description: 'Set theory, binary operations, polynomials, mapping systems, and coordinate vectors.' },
        { name: 'Biology', code: 'SS1-BIO', description: 'Plant vs animal cellular structures, soil nutrients transport, vertebrae, and mammalian skeletal structure.' },
        { name: 'Economics', code: 'SS1-ECO', description: 'Basic microeconomics: demand & supply laws, utility factors, human needs vs resources, and price indices.' },
        { name: 'Yoruba Language', code: 'SS1-YOR', description: 'Tone marks, letters orthography, cultural heritage values, and simple translations.' },
        { name: 'Civic Education', code: 'SS1-CIV', description: 'National values, civic responsibilities, traffic safety codes, and community ethics.' }
      ],
      'Commercial & Social Sciences': [
        { name: 'Financial Accounting', code: 'SS1-ACC', description: 'Double entry cashbooks, general ledger journals, bank reconciliation statements, and trial balances.' },
        { name: 'Economics', code: 'SS1-ECO', description: 'Basic microeconomics: demand & supply laws, utility factors, human needs vs resources, and price indices.' },
        { name: 'Commerce', code: 'SS1-COM', description: 'Foundations of commerce, wholesale and retail trade structures, and early barter currencies.' },
        { name: 'Core Mathematics', code: 'SS1-MTH', description: 'Indices expansions, quadratics, logarithmic indices approximation representation.' },
        { name: 'Further Mathematics', code: 'SS1-FMT', description: 'Set theory, binary operations, polynomials, mapping systems, and coordinate vectors.' },
        { name: 'Biology', code: 'SS1-BIO', description: 'Plant vs animal cellular structures, soil nutrients transport, vertebrae, and mammalian skeletal structure.' },
        { name: 'English Language', code: 'SS1-ENG', description: 'Grammar patterns, correspondence letters, summaries writing, and verbal register analysis.' },
        { name: 'Yoruba Language', code: 'SS1-YOR', description: 'Tone marks, letters orthography, cultural heritage values, and simple translations.' },
        { name: 'Civic Education', code: 'SS1-CIV', description: 'National values, civic responsibilities, traffic safety codes, and community ethics.' }
      ]
    }
  },
  'SSS 2': {
    name: 'Senior Secondary 2 (SSS 2)',
    isSenior: true,
    departments: {
      'Sciences (STEM)': [
        { name: 'Core Mathematics', code: 'SS2-MTH', description: 'Slope coordinates, circle theorems, tangent chord geometry proofs, and sine/cosine trigonometric laws.' },
        { name: 'Further Mathematics', code: 'SS2-FMT', description: 'Linear equations transformations, trigonometric limits, coordinates conic sections, and vectors analysis.' },
        { name: 'Physics', code: 'SS2-PHY', description: 'Momentum collisions, focal plane reflections, wave optics, electricity circuits, and ammeter setups.' },
        { name: 'Chemistry', code: 'SS2-CHM', description: 'Stoichiometry balancing, volumetric acid-base titrations, water hardness metrics, and gases kinetic theories.' },
        { name: 'Biology', code: 'SS2-BIO', description: 'Mammalian nervous system coordination, endocrine gland hormones, plant photosynthesis, and ecological surveys.' },
        { name: 'Economics', code: 'SS2-ECO', description: 'Macroeconomics: national income definitions, inflation indices, central banking tools, and international trades.' },
        { name: 'English Language', code: 'SS2-ENG', description: 'Argumentative layout, punctuation, word stress, legal register systems, and concord rules.' },
        { name: 'Yoruba Language', code: 'SS2-YOR', description: 'Compound grammar translations, orthography structures, Yoruba proverbs (Owe), and historical reviews.' },
        { name: 'Civic Education', code: 'SS2-CIV', description: 'Human rights laws, rule of law, citizenship forms, national unification values, and security systems.' }
      ],
      'Arts & Humanities': [
        { name: 'English Language', code: 'SS2-ENG', description: 'Argumentative essays, concordance structures, complex reading comprehensions, and word stress patterns.' },
        { name: 'Literature-in-English', code: 'SS2-LIT', description: 'Character analysis of WAEC core novels, poetic literary themes, and critical drama comparisons.' },
        { name: 'Government', code: 'SS2-GOV', description: 'Democratic structures, colonial rule systems (indirect rule vs assimilation), and political party foundations.' },
        { name: 'History', code: 'SS2-HIS', description: 'Colonial penetrations of West Africa, resistance campaigns, and early local nationalism movements.' },
        { name: 'Christian/Islamic Religious Studies', code: 'SS2-REL', description: 'Prophetic historical books, theological arguments, moral choices, and traditional religious practices.' },
        { name: 'Further Mathematics', code: 'SS2-FMT', description: 'Linear equations transformations, trigonometric limits, coordinates conic sections, and vectors analysis.' },
        { name: 'Biology', code: 'SS2-BIO', description: 'Mammalian nervous system coordination, endocrine gland hormones, plant photosynthesis, and ecological surveys.' },
        { name: 'Economics', code: 'SS2-ECO', description: 'Macroeconomics: national income definitions, inflation indices, central banking tools, and international trades.' },
        { name: 'Yoruba Language', code: 'SS2-YOR', description: 'Compound grammar translations, orthography structures, Yoruba proverbs (Owe), and historical reviews.' },
        { name: 'Civic Education', code: 'SS2-CIV', description: 'Human rights laws, rule of law, citizenship forms, national unification values, and security systems.' }
      ],
      'Commercial & Social Sciences': [
        { name: 'Financial Accounting', code: 'SS2-ACC', description: 'Trading, profit & loss statement calculations, balance sheets, capital depreciation methods, and adjustments.' },
        { name: 'Economics', code: 'SS2-ECO', description: 'Macroeconomics: national income definitions, inflation indices, central banking tools, and international trades.' },
        { name: 'Commerce', code: 'SS2-COM', description: 'Transportation modes, warehousing operations logic, commercial banking loans, and insurance risks.' },
        { name: 'Core Mathematics', code: 'SS2-MTH', description: 'Circle theorems, tangent metrics, trigonometric calculations, and probability analysis.' },
        { name: 'Further Mathematics', code: 'SS2-FMT', description: 'Linear equations transformations, trigonometric limits, coordinates conic sections, and vectors analysis.' },
        { name: 'Biology', code: 'SS2-BIO', description: 'Mammalian nervous system coordination, endocrine gland hormones, plant photosynthesis, and ecological surveys.' },
        { name: 'English Language', code: 'SS2-ENG', description: 'Comprehending economics registers, formal expository speech, and syntactic parsing.' },
        { name: 'Yoruba Language', code: 'SS2-YOR', description: 'Compound grammar translations, orthography structures, Yoruba proverbs (Owe), and historical reviews.' },
        { name: 'Civic Education', code: 'SS2-CIV', description: 'Human rights laws, rule of law, citizenship forms, national unification values, and security systems.' }
      ]
    }
  },
  'SSS 3': {
    name: 'Senior Secondary 3 (SSS 3)',
    isSenior: true,
    departments: {
      'Sciences (STEM)': [
        { name: 'Core Mathematics', code: 'SS3-MTH', description: 'Differential integrations calculus, matrix multiplications, solid shape geometry, and standard deviations.' },
        { name: 'Further Mathematics', code: 'SS3-FMT', description: 'Integration methods, matrix determinant equations, differential vectors arithmetic, and mechanics equilibria.' },
        { name: 'Physics', code: 'SS3-PHY', description: 'Electromagnetic induction, alternating currents, radioactive decay models, and photo-electric effects.' },
        { name: 'Chemistry', code: 'SS3-CHM', description: 'Electrolysis rules, carbon polymers structures, soap saponification, and qualitative salt analyses.' },
        { name: 'Biology', code: 'SS3-BIO', description: 'Genetic breeding hybrids, DNA cross-overs, evolutionary taxonomy structures, and balance of nature.' },
        { name: 'Economics', code: 'SS3-ECO', description: 'Economic developmental plans, petroleum industries structures, international economic blocks (ECOWAS, WTO), and exchange rates.' },
        { name: 'English Language', code: 'SS3-ENG', description: 'Mock exam timing, formal report drafts, grammatical analysis clauses, and absolute phonetics.' },
        { name: 'Yoruba Language', code: 'SS3-YOR', description: 'Akoto spelling rules, comprehensive literal texts, poetry analysis (Ewi), and West African Yoruba mock preparation.' },
        { name: 'Civic Education', code: 'SS3-CIV', description: 'International treaties, ECOWAS and African Union memberships, drug abuse prevention, and mock exam drills.' }
      ],
      'Arts & Humanities': [
        { name: 'English Language', code: 'SS3-ENG', description: 'Expository essay timing, clause structures analysis, summary evaluation mocks, and speaking phonetics.' },
        { name: 'Literature-in-English', code: 'SS3-LIT', description: 'Final analytical focus on WAEC novels, poetic metrics, and drama motifs.' },
        { name: 'Government', code: 'SS3-GOV', description: 'International policies, ECOWAS structures, African Union, NEPAD, and global diplomatic protocols.' },
        { name: 'History', code: 'SS3-HIS', description: 'Post-independence West African republics history, coup cycles, and civilian restorations.' },
        { name: 'Christian/Islamic Religious Studies', code: 'SS3-REL', description: 'Espousal teachings, epistles analysis, traditional values conflicts, and modern human relations.' },
        { name: 'Further Mathematics', code: 'SS3-FMT', description: 'Integration methods, matrix determinant equations, differential vectors arithmetic, and mechanics equilibria.' },
        { name: 'Biology', code: 'SS3-BIO', description: 'Genetic breeding hybrids, DNA cross-overs, evolutionary taxonomy structures, and balance of nature.' },
        { name: 'Economics', code: 'SS3-ECO', description: 'Economic developmental plans, petroleum industries structures, international economic blocks (ECOWAS, WTO), and exchange rates.' },
        { name: 'Yoruba Language', code: 'SS3-YOR', description: 'Akoto spelling rules, comprehensive literal texts, poetry analysis (Ewi), and West African Yoruba mock preparation.' },
        { name: 'Civic Education', code: 'SS3-CIV', description: 'International treaties, ECOWAS and African Union memberships, drug abuse prevention, and mock exam drills.' }
      ],
      'Commercial & Social Sciences': [
        { name: 'Financial Accounting', code: 'SS3-ACC', description: 'Partnership dissolve accounts, company share capital accounts, non-profit events balance, and ratio audits.' },
        { name: 'Economics', code: 'SS3-ECO', description: 'Economic developmental plans, petroleum industries structures, international economic blocks (ECOWAS, WTO), and exchange rates.' },
        { name: 'Commerce', code: 'SS3-COM', description: 'Electronic commerce channels, business merge protocols, stock exchange trades, and export shipping logistics.' },
        { name: 'Core Mathematics', code: 'SS3-MTH', description: 'Calculus derivatives, matrices determinants, solid shapes parameters, and standard deviation.' },
        { name: 'Further Mathematics', code: 'SS3-FMT', description: 'Integration methods, matrix determinant equations, differential vectors arithmetic, and mechanics equilibria.' },
        { name: 'Biology', code: 'SS3-BIO', description: 'Genetic breeding hybrids, DNA cross-overs, evolutionary taxonomy structures, and balance of nature.' },
        { name: 'English Language', code: 'SS3-ENG', description: 'Grammar review, speech patterns, summary assessments, and professional business registers.' },
        { name: 'Yoruba Language', code: 'SS3-YOR', description: 'Akoto spelling rules, comprehensive literal texts, poetry analysis (Ewi), and West African Yoruba mock preparation.' },
        { name: 'Civic Education', code: 'SS3-CIV', description: 'International treaties, ECOWAS and African Union memberships, drug abuse prevention, and mock exam drills.' }
      ]
    }
  }
};

export const SEED_STUDENTS: StudentRecord[] = [];

export function calculateGrade(score: number): { grade: string; remark: string; isPass: boolean } {
  if (score >= 75) return { grade: 'A1', remark: 'Excellent', isPass: true };
  if (score >= 70) return { grade: 'B2', remark: 'Very Good', isPass: true };
  if (score >= 65) return { grade: 'B3', remark: 'Good', isPass: true };
  if (score >= 60) return { grade: 'C4', remark: 'Credit', isPass: true };
  if (score >= 55) return { grade: 'C5', remark: 'Credit', isPass: true };
  if (score >= 50) return { grade: 'C6', remark: 'Credit', isPass: true };
  if (score >= 45) return { grade: 'D7', remark: 'Pass', isPass: true };
  if (score >= 40) return { grade: 'E8', remark: 'Pass', isPass: true };
  return { grade: 'F9', remark: 'Fail', isPass: false };
}

export function calculateGPA(results: Record<string, { ca: number; exam: number }>): number {
  const subjects = Object.values(results);
  if (subjects.length === 0) return 0;
  
  let totalPoints = 0;
  subjects.forEach(r => {
    const score = r.ca + r.exam;
    if (score >= 75) totalPoints += 5; // A1
    else if (score >= 65) totalPoints += 4; // B2, B3
    else if (score >= 50) totalPoints += 3; // C4, C5, C6
    else if (score >= 40) totalPoints += 2; // D7, E8
    else totalPoints += 1; // F9
  });
  
  return parseFloat((totalPoints / subjects.length).toFixed(2));
}
