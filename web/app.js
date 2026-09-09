// =============================================================================
// Saathi – Multilingual Voice Livelihood Assistant (Frontend Controller)
// =============================================================================

// Global State
let allBeneficiaries = [];
let catalogData = { trainingPrograms: [], opportunities: [] };
let currentAppLang = 'en-IN'; // 'te-IN' | 'ta-IN' | 'hi-IN' | 'kn-IN' | 'en-IN'
let currentAppLanguage = 'en-IN';
let chatVoiceEnabled = true;
let currentModalBenId = null;

// =============================================================================
// UNIVERSAL I18N TRANSLATION DICTIONARY
// =============================================================================
const I18N = {
    'en-IN': {
        header_title: 'Officer Dashboard',
        header_subtitle: 'Training-to-Placement Pipeline & Real-Time Monitoring',
        chip_schemes: 'PM-DAKSH & NBCFDC Aligned',
        btn_register_beneficiary: '+ Register Beneficiary',
        nav_dashboard: 'Dashboard',
        nav_profiler: 'Beneficiary Profiler',
        nav_training: 'AI Training Engine',
        nav_jobs: 'Job & Placement',
        nav_roadmap: 'Livelihood Roadmap',
        nav_catalogs: 'Program Catalogs',
        db_status: 'saathi.db Connected',
        gateway_badge: '✨ Multi-Modal Beneficiary Intake',
        gateway_title: 'Select Onboarding Pathway',
        gateway_subtitle: 'Choose the intake method tailored for your beneficiary\'s digital accessibility level',
        pill_call: 'Interactive Voice Agent',
        card_call_title: 'Assisted Voice Call',
        card_call_desc: 'One-click simulated telephone call. The AI officer asks questions out loud in your native language with automatic turn-taking.',
        btn_start_ai_call: '🎙️ Start AI Call',
        pill_ptt: 'Push-to-Talk Guided',
        card_ptt_title: 'Voice Note Registration',
        card_ptt_desc: 'Step-by-step intake with a large tactile microphone button. Hold or tap to speak your response with real-time feedback.',
        btn_voice_intake: '🎤 Voice Intake',
        pill_form: 'Direct Manual Entry',
        card_form_title: 'Direct Form Entry',
        card_form_desc: 'Traditional structured registration form, fully translated into Telugu, Tamil, Hindi, Kannada, or English.',
        btn_open_form: '📋 Open Form',
        metric_total: 'Total Beneficiaries',
        metric_enrolled: 'Enrolled / Training',
        metric_placed: 'Placed / Self-Employed',
        metric_support: 'Needs Officer Support',
        hitl_title: 'HUMAN-IN-THE-LOOP ALERT TRIGGERED!',
        hitl_desc: 'There are beneficiaries marked \'Needs Officer Support\'. Please review their profiles below.',
        btn_filter_support: 'Filter Support Cases',
        table_pipeline_title: 'Beneficiary Pipeline Overview',
        ph_dash_search: 'Filter by Name, ID, Region...',
        btn_refresh: 'Refresh',
        th_id: 'ID',
        th_name: 'Name',
        th_phone: 'Phone',
        th_region: 'Region',
        th_status: 'Pipeline Status',
        th_date: 'Registration Date',
        th_action: 'Action',
        loading_beneficiaries: 'Loading beneficiaries...',
        no_beneficiaries: 'No beneficiaries found in database.',
        btn_profile: '👁️ Profile',
        btn_status: '✏️ Status',
        reg_form_title: '📋 New Beneficiary Registration',
        btn_voice_demo: '🎤 Voice-Fill Demo (Click Me)',
        label_fullname: 'Full Name *',
        ph_fullname: 'e.g. Ramesh Kumar',
        label_phone: 'Phone Number *',
        ph_phone: 'e.g. 9876543210',
        label_language: 'Interaction Language',
        opt_lang_te: 'Telugu (తెలుగు)',
        opt_lang_ta: 'Tamil (தமிழ்)',
        opt_lang_hi: 'Hindi (हिंदी)',
        opt_lang_kn: 'Kannada (ಕನ್ನಡ)',
        opt_lang_en: 'English',
        label_education: 'Education Level',
        opt_edu_10th: '10th Pass',
        opt_edu_12th: '12th Pass',
        opt_edu_grad: 'Graduate',
        opt_edu_iti: 'ITI / Diploma',
        opt_edu_none: 'Illiterate / None',
        label_famocc: 'Family / Traditional Occupation',
        ph_famocc: 'e.g. Agriculture, Weaving, Leatherwork',
        label_curliv: 'Current Livelihood',
        ph_curliv: 'e.g. Daily Wager, Unemployed',
        label_skills: 'Existing Skills',
        ph_skills: 'e.g. Basic Computer, Sewing, Wiring',
        label_interests: 'Stated Interests',
        ph_interests: 'e.g. Fashion, Electronics, Data Entry',
        label_aspirations: 'Future Aspirations',
        ph_aspirations: 'e.g. Start Small Business, Technician',
        label_constraints: 'Mobility Constraints',
        ph_constraints: 'e.g. Local only, Night shift restriction',
        label_emppref: 'Employment Preference',
        opt_emp_wage: 'Wage Employment',
        opt_emp_self: 'Self Employment',
        opt_emp_both: 'Both',
        label_region: 'Region / District',
        ph_region: 'e.g. Rural - Salem, Tirupati',
        btn_submit_reg: '✓ Register & Save to saathi.db',
        profiles_title: '👤 Registered Beneficiary Profiles',
        ph_search_profiles: 'Search by name, ID, or region...',
        empty_select_ben: 'Select a beneficiary from the list to view profile card.',
        label_select_ben: 'Select Beneficiary:',
        btn_gen_training: '🎯 Generate AI Training Recommendations',
        empty_training: 'Select a beneficiary and click \'Generate AI Training Recommendations\'.',
        btn_gen_jobs: '💼 Generate Job Matches',
        empty_jobs: 'Select a beneficiary and click \'Generate Job Matches\'.',
        btn_view_roadmap_tab: '🗺️ View Personalized Livelihood Roadmap',
        empty_roadmap: 'Select a beneficiary to visualize their 6-step livelihood timeline.',
        subtab_training: 'NSQF Aligned Training Programmes',
        subtab_jobs: 'Local Job & Livelihood Opportunities',
        th_prog_name: 'Program Name',
        th_nsqf_level: 'NSQF Level',
        th_emp_type: 'Employment Type',
        th_duration: 'Duration',
        th_keywords: 'Keywords',
        th_opp_name: 'Opportunity Name',
        th_type: 'Type',
        th_req_skill: 'Required Skill',
        th_desc: 'Description',
        ob_title: 'Register a Beneficiary',
        ob_subtitle: 'Choose how you\'d like to collect information',
        ob_mode_direct_title: 'Direct App Usage',
        ob_mode_direct_desc: 'Type answers step-by-step in the conversational form',
        ob_badge_text: 'Text Input',
        ob_mode_voice_title: 'Voice Note Registration',
        ob_mode_voice_desc: 'Push-to-talk speech-to-text guided intake',
        ob_badge_ptt: 'Push-to-Talk',
        ob_mode_ivr_title: 'IVR / Phone Call',
        ob_mode_ivr_desc: 'Simulated telephony conversational flow',
        ob_badge_ivr: 'IVR Simulated',
        btn_back: '← Back',
        ob_lang_title: 'Select Your Language',
        ob_lang_subtitle: 'All questions will be in your chosen language',
        ob_lang_sidebar_title: 'Language',
        ob_lang_sidebar_sub: 'Switch anytime',
        ob_qa_saathi_ai: 'Saathi AI Guided Intake',
        ob_tip_speak: 'Hold button to speak clearly',
        ptt_release_submit: 'Release when finished speaking',
        btn_cancel: '✕ Cancel',
        ph_type_answer: 'Type your answer here...',
        btn_next: 'Next →',
        ptt_hold_speak: 'Tap / Hold to Speak',
        btn_sample_voice: 'Sample Answer',
        btn_submit_ans: 'Submit →',
        ivr_clear: 'Clear',
        ivr_submit: 'Submit #',
        ob_success_title: 'Registration Complete!',
        ob_success_desc: 'The beneficiary profile has been created and saved to saathi.db',
        ob_ben_id_label: 'Beneficiary ID',
        ob_pipeline_status_label: 'Pipeline Status',
        btn_view_dash: 'View Dashboard',
        btn_reg_another: 'Register Another',
        call_agent_name: 'Saathi AI Voice Officer',
        call_state_title: 'Language Selection',
        call_state_desc: 'Please choose your preferred language',
        call_choose_lang_title: 'Select Your Language / भाषा चुनें',
        call_lang_listen: '🎙️ Listening… speak the name of your language',
        fallback_title: '⌨️ Type Answer Instead',
        ph_call_answer: 'Type your answer here...',
        btn_submit: 'Submit',
        ctrl_replay: 'Replay',
        ctrl_type: 'Type',
        ctrl_end_call: 'End Call',
        prof_modal_title: 'Beneficiary Profile',
        btn_close: 'Close',
        btn_view_roadmap: '🗺️ View Personalized Roadmap',
        status_modal_title: 'Update Pipeline Status',
        label_select_status: 'Select New Status:',
        st_created: 'Profile Created',
        st_rec_gen: 'Recommendation Generated',
        st_enrolled: 'Enrolled',
        st_training_prog: 'Training In Progress',
        st_training_comp: 'Training Completed',
        st_placed: 'Placed',
        st_self_emp: 'Self-Employment Started',
        st_hitl: 'Needs Officer Support (HITL)',
        btn_modal_cancel: 'Cancel',
        btn_save_status: 'Save Status to saathi.db',
        lbl_lang: 'Language',
        lbl_phone: 'Phone',
        lbl_edu: 'Education',
        lbl_curliv: 'Current Livelihood',
        lbl_famocc: 'Family Occupation',
        lbl_skills: 'Skills',
        lbl_interests: 'Interests',
        lbl_aspirations: 'Aspirations',
        lbl_constraints: 'Constraints',
        lbl_emppref: 'Employment Pref',
        lbl_region: 'Region',
        lbl_registered: 'Registered',
        btn_full_profile: '👁️ Full Multilingual Profile',
        btn_update_status: '✏️ Update Pipeline Status',
        rm_for: 'Roadmap for',
        rm_target_prog: 'Target Program',
        rm_target_role: 'Target Role',
        rm_gaps: 'Identified Skill Gaps to Bridge:',
        rm_no_gaps: 'None (Fully Qualified!)',
        rm_step1_title: 'Step 1: Current Baseline & Skill Gap Analysis',
        rm_step1_desc: 'Beneficiary profiled with skills',
        rm_gaps_count: 'critical skills identified to develop',
        rm_step2_title: 'Step 2: Enrollment in',
        rm_covers: 'Covers',
        rm_step3_title: 'Step 3: Placement into',
        rm_step3_desc: 'Post-certification linkage with local employers and enterprise credit schemes.',
        rm_completed: '✓ Completed',
        rm_next_action: '⏳ Next Action',
        rm_upcoming: 'Upcoming',
        rm_generating: 'Generating Personalized Livelihood Roadmap...',
        rm_error: 'Could not generate roadmap for this beneficiary.',
        tr_running: 'Running AI Recommendation Algorithm...',
        tr_no_rec: 'No matching training programs found.',
        tr_match_score: 'Match Score',
        tr_why_matched: 'Why this program was matched:',
        err_training: 'Error generating recommendations.',
        jb_matching: 'Matching with Local Opportunities...',
        jb_no_opp: 'No matching job opportunities found.',
        jb_score: 'Score',
        jb_criteria: 'Match Criteria:',
        err_jobs: 'Error generating job matches.',
        alert_select_ben: 'Please select a beneficiary.'
    },
    'te-IN': {
        header_title: 'అధికారి డ్యాష్‌బోర్డ్',
        header_subtitle: 'శిక్షణ నుండి ఉపాధి వరకు పైప్‌లైన్ & రియల్-టైమ్ పర్యవేక్షణ',
        chip_schemes: 'PM-DAKSH & NBCFDC అనుగుణమైనది',
        btn_register_beneficiary: '+ లబ్ధిదారుని నమోదు చేయండి',
        nav_dashboard: 'డ్యాష్‌బోర్డ్',
        nav_profiler: 'లబ్ధిదారుల ప్రొఫైలర్',
        nav_training: 'AI శిక్షణ ఇంజిన్',
        nav_jobs: 'ఉద్యోగ & నియామకాలు',
        nav_roadmap: 'ఉపాధి రోడ్‌మ్యాప్',
        nav_catalogs: 'కార్యక్రమాల కేటలాగ్',
        db_status: 'saathi.db అనుసంధానించబడింది',
        gateway_badge: '✨ బహుళ-మాధ్యమ నమోదు మార్గాలు',
        gateway_title: 'నమోదు విధానాన్ని ఎంచుకోండి',
        gateway_subtitle: 'లబ్ధిదారునికి అనువైన సౌకర్యవంతమైన నమోదు విధానాన్ని ఎంచుకోండి',
        pill_call: 'ఇంటరాక్టివ్ వాయిస్ ఏజెంట్',
        card_call_title: 'వాయిస్ కాల్ సహాయం (AI కాల్)',
        card_call_desc: 'నేరుగా బ్రౌజర్‌లో వాయిస్ కాల్. AI అధికారి మీతో తెలుగులో ప్రశ్నలు అడుగుతూ వివరాలు సేకరిస్తారు.',
        btn_start_ai_call: '🎙️ AI కాల్ ప్రారంభించు',
        pill_ptt: 'వాయిస్ నోట్ గైడెడ్',
        card_ptt_title: 'వాయిస్ నోట్ నమోదు',
        card_ptt_desc: 'పెద్ద మైక్రోఫోన్ బటన్ నొక్కి మాట్లాడి దశలవారీగా మీ వివరాలను సులభంగా నమోదు చేయండి.',
        btn_voice_intake: '🎤 వాయిస్ నమోదు',
        pill_form: 'నేరుగా ఫారమ్ ఎంట్రీ',
        card_form_title: 'డైరెక్ట్ ఫారమ్ నమోదు',
        card_form_desc: 'సాంప్రదాయ నమోదు ఫారమ్, తెలుగు భాషలో స్పష్టమైన ఫీల్డ్ సూచనలతో.',
        btn_open_form: '📋 ఫారమ్ తెరవండి',
        metric_total: 'మొత్తం లబ్ధిదారులు',
        metric_enrolled: 'శిక్షణలో ఉన్నవారు',
        metric_placed: 'ఉపాధి పొందినవారు',
        metric_support: 'అధికారి సహాయం కావాల్సినవారు',
        hitl_title: 'మానవ సహాయ హెచ్చరిక!',
        hitl_desc: 'కొందరు లబ్ధిదారులకు అధికారి సహాయం అవసరం. దయచేసి వారి వివరాలను పరిశీలించండి.',
        btn_filter_support: 'సహాయ కేసులు చూపించు',
        table_pipeline_title: 'లబ్ధిదారుల పైప్‌లైన్ వివరాలు',
        ph_dash_search: 'పేరు, ఐడి, ప్రాంతం ద్వారా శోధించండి...',
        btn_refresh: 'తాజాకరించు',
        th_id: 'ఐడి',
        th_name: 'పేరు',
        th_phone: 'ఫోన్ నంబర్',
        th_region: 'ప్రాంతం',
        th_status: 'పైప్‌లైన్ స్థితి',
        th_date: 'నమోదు తేదీ',
        th_action: 'చర్య',
        loading_beneficiaries: 'లబ్ధిదారుల వివరాలు లోడ్ అవుతున్నాయి...',
        no_beneficiaries: 'డేటాబేస్‌లో లబ్ధిదారులు ఎవరూ కనుగొనబడలేదు.',
        btn_profile: '👁️ ప్రొఫైల్',
        btn_status: '✏️ స్థితి',
        reg_form_title: '📋 కొత్త లబ్ధిదారుని నమోదు',
        btn_voice_demo: '🎤 వాయిస్-ఫిల్ డెమో (క్లిక్ చేయండి)',
        label_fullname: 'పూర్తి పేరు *',
        ph_fullname: 'ఉదా. రమేష్ కుమార్',
        label_phone: 'ఫోన్ నంబర్ *',
        ph_phone: 'ఉదా. 9876543210',
        label_language: 'సంభాషణ భాష',
        opt_lang_te: 'తెలుగు (Telugu)',
        opt_lang_ta: 'తమిళం (Tamil)',
        opt_lang_hi: 'హిందీ (Hindi)',
        opt_lang_kn: 'కన్నడ (Kannada)',
        opt_lang_en: 'ఇంగ్లీష్ (English)',
        label_education: 'విద్యార్హత',
        opt_edu_10th: '10వ తరగతి పాస్',
        opt_edu_12th: '12వ తరగతి / ఇంటర్మీడియట్ పాస్',
        opt_edu_grad: 'డిగ్రీ / గ్రాడ్యుయేట్',
        opt_edu_iti: 'ITI / డిప్లొమా',
        opt_edu_none: 'చదువు లేదు / నిరక్షరాస్యులు',
        label_famocc: 'కుటుంబ / సాంప్రదాయ వృత్తి',
        ph_famocc: 'ఉదా. వ్యవసాయం, చేనేత, తోలుపని',
        label_curliv: 'ప్రస్తుత జీవనోపాధి',
        ph_curliv: 'ఉదా. దినసరి కూలీ, నిరుద్యోగి',
        label_skills: 'ప్రస్తుత నైపుణ్యాలు',
        ph_skills: 'ఉదా. కంప్యూటర్ బేసిక్స్, కుట్టుపని, వైరింగ్',
        label_interests: 'ఆసక్తులు',
        ph_interests: 'ఉదా. ఫ్యాషన్, ఎలక్ట్రానిక్స్, డేటా ఎంట్రీ',
        label_aspirations: 'భవిష్యత్ ఆశయాలు',
        ph_aspirations: 'ఉదా. చిన్న వ్యాపారం, టెక్నీషియన్',
        label_constraints: 'మొబిలిటీ పరిమితులు',
        ph_constraints: 'ఉదా. స్థానిక ప్రాంతం మాత్రమే',
        label_emppref: 'ఉపాధి ప్రాధాన్యత',
        opt_emp_wage: 'వేతన ఉద్యోగం',
        opt_emp_self: 'స్వయం ఉపాధి',
        opt_emp_both: 'రెండూ',
        label_region: 'ప్రాంతం / జిల్లా',
        ph_region: 'ఉదా. గ్రామీణ - సేలం, తిరుపతి',
        btn_submit_reg: '✓ నమోదు చేసి saathi.db లో భద్రపరచండి',
        profiles_title: '👤 నమోదు చేసుకున్న లబ్ధిదారుల ప్రొఫైల్స్',
        ph_search_profiles: 'పేరు, ఐడి లేదా ప్రాంతం ద్వారా వెతకండి...',
        empty_select_ben: 'ప్రొఫైల్ కార్డును చూడటానికి జాబితా నుండి లబ్ధిదారుని ఎంచుకోండి.',
        label_select_ben: 'లబ్ధిదారుని ఎంచుకోండి:',
        btn_gen_training: '🎯 AI శిక్షణ సిఫార్సులను రూపొందించండి',
        empty_training: 'లబ్ధిదారుని ఎంచుకుని \'AI శిక్షణ సిఫార్సులను రూపొందించండి\' పై క్లిక్ చేయండి.',
        btn_gen_jobs: '💼 ఉద్యోగ అవకాశాలను రూపొందించండి',
        empty_jobs: 'లబ్ధిదారుని ఎంచుకుని \'ఉద్యోగ అవకాశాలను రూపొందించండి\' పై క్లిక్ చేయండి.',
        btn_view_roadmap_tab: '🗺️ వ్యక్తిగతీకరించిన ఉపాధి రోడ్‌మ్యాప్ చూడండి',
        empty_roadmap: '6-దశల ఉపాధి కాలక్రమాన్ని చూడటానికి లబ్ధిదారుని ఎంచుకోండి.',
        subtab_training: 'NSQF గుర్తింపు పొందిన శిక్షణా కార్యక్రమాలు',
        subtab_jobs: 'స్థానిక ఉద్యోగ & ఉపాధి అవకాశాలు',
        th_prog_name: 'కార్యక్రమం పేరు',
        th_nsqf_level: 'NSQF స్థాయి',
        th_emp_type: 'ఉపాధి రకం',
        th_duration: 'వ్యవధి',
        th_keywords: 'కీలకపదాలు',
        th_opp_name: 'అవకాశం పేరు',
        th_type: 'రకం',
        th_req_skill: 'అవసరమైన నైపుణ్యం',
        th_desc: 'వివరణ',
        ob_title: 'లబ్ధిదారుని నమోదు చేయండి',
        ob_subtitle: 'సమాచారాన్ని ఎలా సేకరించాలనుకుంటున్నారో ఎంచుకోండి',
        ob_mode_direct_title: 'నేరుగా యాప్ ద్వారా',
        ob_mode_direct_desc: 'సంభాషణ ఫారమ్‌లో సమాధానాలను టైప్ చేయండి',
        ob_badge_text: 'టెక్స్ట్ నమోదు',
        ob_mode_voice_title: 'వాయిస్ నోట్ నమోదు',
        ob_mode_voice_desc: 'వాయిస్ ద్వారా సులభంగా మాట్లాడి నమోదు చేసే విధానం',
        ob_badge_ptt: 'పుష్-టు-టాక్',
        ob_mode_ivr_title: 'IVR / ఫోన్ కాల్',
        ob_mode_ivr_desc: 'టెలిఫోన్ కాల్ సంభాషణ విధానం',
        ob_badge_ivr: 'IVR కాల్',
        btn_back: '← వెనుకకు',
        ob_lang_title: 'మీ భాషను ఎంచుకోండి',
        ob_lang_subtitle: 'అన్ని ప్రశ్నలు మీరు ఎంచుకున్న భాషలో ఉంటాయి',
        ob_lang_sidebar_title: 'భాష',
        ob_lang_sidebar_sub: 'ఎప్పుడైనా మార్చండి',
        ob_qa_saathi_ai: 'సాధి AI మార్గదర్శక నమోదు',
        ob_tip_speak: 'స్పష్టంగా మాట్లాడటానికి బటన్‌ను నొక్కి పట్టుకోండి',
        ptt_release_submit: 'మాట్లాడటం పూర్తయిన తర్వాత విడుదల చేయండి',
        btn_cancel: '✕ రద్దు చేయి',
        ph_type_answer: 'మీ సమాధానాన్ని ఇక్కడ టైప్ చేయండి...',
        btn_next: 'తరువాత →',
        ptt_hold_speak: 'నొక్కండి / మాట్లాడటానికి పట్టుకోండి',
        btn_sample_voice: 'నమూనా సమాధానం',
        btn_submit_ans: 'సమర్పించు →',
        ivr_clear: 'క్లియర్',
        ivr_submit: 'సమర్పించు #',
        ob_success_title: 'నమోదు పూర్తయింది!',
        ob_success_desc: 'లబ్ధిదారుని ప్రొఫైల్ సృష్టించబడింది మరియు saathi.db లో భద్రపరచబడింది',
        ob_ben_id_label: 'లబ్ధిదారుని ఐడి',
        ob_pipeline_status_label: 'పైప్‌లైన్ స్థితి',
        btn_view_dash: 'డ్యాష్‌బోర్డ్ చూడండి',
        btn_reg_another: 'మరొకరిని నమోదు చేయండి',
        call_agent_name: 'సాథి AI వాయిస్ అధికారి',
        call_state_title: 'భాష ఎంపిక',
        call_state_desc: 'దయచేసి మీ ప్రాధాన్య భాషను ఎంచుకోండి',
        call_choose_lang_title: 'మీ భాషను ఎంచుకోండి / Select Language',
        call_lang_listen: '🎙️ వింటున్నాము… మీ భాష పేరు చెప్పండి',
        fallback_title: '⌨️ బదులుగా సమాధానం టైప్ చేయండి',
        ph_call_answer: 'మీ సమాధానాన్ని ఇక్కడ టైప్ చేయండి...',
        btn_submit: 'సమర్పించు',
        ctrl_replay: 'మళ్ళీ విను',
        ctrl_type: 'టైప్ చేయి',
        ctrl_end_call: 'కాల్ ముగించు',
        prof_modal_title: 'లబ్ధిదారుని ప్రొఫైల్',
        btn_close: 'మూసివేయి',
        btn_view_roadmap: '🗺️ వ్యక్తిగతీకరించిన రోడ్‌మ్యాప్ చూడండి',
        status_modal_title: 'పైప్‌లైన్ స్థితిని నవీకరించండి',
        label_select_status: 'కొత్త స్థితిని ఎంచుకోండి:',
        st_created: 'ప్రొఫైల్ సృష్టించబడింది',
        st_rec_gen: 'సిఫార్సు రూపొందించబడింది',
        st_enrolled: 'నమోదైంది',
        st_training_prog: 'శిక్షణ కొనసాగుతోంది',
        st_training_comp: 'శిక్షణ పూర్తయింది',
        st_placed: 'ఉద్యోగంలో నియమించబడ్డారు',
        st_self_emp: 'స్వయం ఉపాధి ప్రారంభించబడింది',
        st_hitl: 'అధికారి సహాయం కావాలి (HITL)',
        btn_modal_cancel: 'రద్దు చేయి',
        btn_save_status: 'స్థితిని saathi.db లో భద్రపరచండి',
        lbl_lang: 'భాష',
        lbl_phone: 'ఫోన్ నంబర్',
        lbl_edu: 'విద్యార్హత',
        lbl_curliv: 'ప్రస్తుత జీవనోపాధి',
        lbl_famocc: 'కుటుంబ వృత్తి',
        lbl_skills: 'నైపుణ్యాలు',
        lbl_interests: 'ఆసక్తులు',
        lbl_aspirations: 'ఆశయాలు',
        lbl_constraints: 'పరిమితులు',
        lbl_emppref: 'ఉపాధి ప్రాధాన్యత',
        lbl_region: 'ప్రాంతం',
        lbl_registered: 'నమోదైన తేదీ',
        btn_full_profile: '👁️ పూర్తి ప్రొఫైల్ చూడండి',
        btn_update_status: '✏️ స్థితిని మార్చండి',
        rm_for: 'ఉపాధి ప్రణాళిక:',
        rm_target_prog: 'లక్ష్య కార్యక్రమం',
        rm_target_role: 'లక్ష్య పాత్ర',
        rm_gaps: 'అభివృద్ధి చేయవలసిన నైపుణ్యాలు:',
        rm_no_gaps: 'ఏమీ లేవు (పూర్తి అర్హత ఉంది!)',
        rm_step1_title: 'దశ 1: నైపుణ్యాల విశ్లేషణ మరియు బేస్‌లైన్',
        rm_step1_desc: 'లబ్ధిదారునికి ఉన్న నైపుణ్యాలు',
        rm_gaps_count: 'ముఖ్యమైన నైపుణ్యాలు నేర్చుకోవాల్సి ఉంది',
        rm_step2_title: 'దశ 2: శిక్షణలో చేరిక -',
        rm_covers: 'నేర్చుకునే అంశాలు',
        rm_step3_title: 'దశ 3: ఉపాధి కల్పన -',
        rm_step3_desc: 'సర్టిఫికేషన్ తర్వాత స్థానిక యజమానులతో అనుసంధానం మరియు క్రెడిట్ స్కీమ్స్ లింకేజ్.',
        rm_completed: '✓ పూర్తయింది',
        rm_next_action: '⏳ తదుపరి చర్య',
        rm_upcoming: 'రాబోయేది',
        rm_generating: 'వ్యక్తిగతీకరించిన ఉపాధి రోడ్‌మ్యాప్ రూపొందుతోంది...',
        rm_error: 'రోడ్‌మ్యాప్ రూపొందించడం సాధ్యం కాలేదు.',
        tr_running: 'AI శిక్షణ సిఫార్సుల అల్గారిథమ్ రన్ అవుతోంది...',
        tr_no_rec: 'సరిపోయే శిక్షణ కార్యక్రమాలు కనుగొనబడలేదు.',
        tr_match_score: 'సరిపోలిక స్కోరు',
        tr_why_matched: 'ఈ కార్యక్రమం ఎందుకు సరిపోలింది:',
        err_training: 'సిఫార్సులను రూపొందించడంలో లోపం జరిగింది.',
        jb_matching: 'స్థానిక అవకాశాలతో సరిపోల్చుతున్నాము...',
        jb_no_opp: 'సరిపోయే ఉద్యోగ అవకాశాలు కనుగొనబడలేదు.',
        jb_score: 'స్కోరు',
        jb_criteria: 'సరిపోలిక ప్రమాణాలు:',
        err_jobs: 'ఉద్యోగ అవకాశాలను రూపొందించడంలో లోపం జరిగింది.',
        alert_select_ben: 'దయచేసి లబ్ధిదారుని ఎంచుకోండి.'
    },
    'ta-IN': {
        header_title: 'அதிகாரி கட்டுப்பாட்டு பலகை',
        header_subtitle: 'பயிற்சி முதல் வேலைவாய்ப்பு வரை நிகழ்நேர கண்காணிப்பு',
        chip_schemes: 'PM-DAKSH & NBCFDC இணக்கமானது',
        btn_register_beneficiary: '+ பயனாளியை பதிவு செய்க',
        nav_dashboard: 'கட்டுப்பாட்டு பலகை',
        nav_profiler: 'பயனாளி விவரக்குறிப்பு',
        nav_training: 'AI பயிற்சி இயந்திரம்',
        nav_jobs: 'வேலை & நியமனம்',
        nav_roadmap: 'வாழ்வாதார வரைபடம்',
        nav_catalogs: 'திட்ட பட்டியல்கள்',
        db_status: 'saathi.db இணைக்கப்பட்டது',
        gateway_badge: '✨ பல வழி பயனாளி சேர்க்கை',
        gateway_title: 'பதிவு செய்யும் முறையை தேர்வு செய்க',
        gateway_subtitle: 'பயனாளியின் வசதிக்கேற்ப ஏற்ற பதிவு முறையை தேர்ந்தெடுக்கவும்',
        pill_call: 'குரல் முகவர் அழைப்பு',
        card_call_title: 'AI நேரடி குரல் அழைப்பு',
        card_call_desc: 'ஒரே கிளிக்கில் நேரடி குரல் அழைப்பு. AI அதிகாரி தமிழில் கேள்விகள் கேட்டு விவரங்களை பதிவு செய்வார்.',
        btn_start_ai_call: '🎙️ AI அழைப்பை தொடங்கு',
        pill_ptt: 'குரல் பதிவு முறை',
        card_ptt_title: 'குரல் குறிப்பு பதிவு',
        card_ptt_desc: 'மைக் பட்டனை அழுத்திப் பேசி படிப்படியாக விவரங்களை பதிவு செய்யும் முறை.',
        btn_voice_intake: '🎤 குரல் பதிவு',
        pill_form: 'நேரடி படிவம்',
        card_form_title: 'நேரடி படிவ பதிவு',
        card_form_desc: 'பாரம்பரிய பதிவு படிவம், முழுமையான தமிழ் மொழிபெயர்ப்புடன்.',
        btn_open_form: '📋 படிவம் திறக்க',
        metric_total: 'மொத்த பயனாளிகள்',
        metric_enrolled: 'பயிற்சியில் உள்ளோர்',
        metric_placed: 'வேலைவாய்ப்பு பெற்றோர்',
        metric_support: 'அதிகாரி உதவி தேவைப்படுவோர்',
        hitl_title: 'அதிகாரி உதவி எச்சரிக்கை!',
        hitl_desc: 'சில பயனாளிகளுக்கு அதிகாரி உதவி தேவைப்படுகிறது. தயவுசெய்து மதிப்பாய்வு செய்யவும்.',
        btn_filter_support: 'வழக்குகளை வடிகட்டு',
        table_pipeline_title: 'பயனாளி நிலை மேலோட்டம்',
        ph_dash_search: 'பெயர், எண், மாவட்டம் மூலம் தேடுக...',
        btn_refresh: 'புதுப்பி',
        th_id: 'எண்',
        th_name: 'பெயர்',
        th_phone: 'தொலைபேசி',
        th_region: 'மாவட்டம்',
        th_status: 'தற்போதைய நிலை',
        th_date: 'பதிவு தேதி',
        th_action: 'செயல்',
        loading_beneficiaries: 'பயனாளிகள் விவரம் ஏற்றப்படுகிறது...',
        no_beneficiaries: 'தரவுத்தளத்தில் பயனாளிகள் இல்லை.',
        btn_profile: '👁️ விவரக்குறிப்பு',
        btn_status: '✏️ நிலை',
        reg_form_title: '📋 புதிய பயனாளி பதிவு',
        btn_voice_demo: '🎤 குரல் பதிவு மாதிரி (கிளிக் செய்க)',
        label_fullname: 'முழு பெயர் *',
        ph_fullname: 'எ.கா. ரமேஷ் குமார்',
        label_phone: 'தொலைபேசி எண் *',
        ph_phone: 'எ.கா. 9876543210',
        label_language: 'தொடர்பு மொழி',
        opt_lang_te: 'தெலுங்கு (Telugu)',
        opt_lang_ta: 'தமிழ் (Tamil)',
        opt_lang_hi: 'இந்தி (Hindi)',
        opt_lang_kn: 'கன்னடம் (Kannada)',
        opt_lang_en: 'ஆங்கிலம் (English)',
        label_education: 'கல்வி தகுதி',
        opt_edu_10th: '10-ஆம் வகுப்பு தேர்ச்சி',
        opt_edu_12th: '12-ஆம் வகுப்பு தேர்ச்சி',
        opt_edu_grad: 'பட்டதாரி',
        opt_edu_iti: 'ITI / டிப்ளமோ',
        opt_edu_none: 'கல்வியறிவற்ற / இல்லை',
        label_famocc: 'குடும்ப / பாரம்பரிய தொழில்',
        ph_famocc: 'எ.கா. விவசாயம், நெசவு, தோல் வேலை',
        label_curliv: 'தற்போதைய வாழ்வாதாரம்',
        ph_curliv: 'எ.கா. தினக்கூலி, வேலையில்லாதவர்',
        label_skills: 'தற்போதைய திறன்கள்',
        ph_skills: 'எ.கா. கணினி, தையல், வயரிங்',
        label_interests: 'ஆர்வமுள்ள துறைகள்',
        ph_interests: 'எ.கா. ஆடை வடிவமைப்பு, மின்னணுவியல்',
        label_aspirations: 'எதிர்கால விருப்பங்கள்',
        ph_aspirations: 'எ.கா. சொந்த தொழில், தொழில்நுட்ப வல்லுநர்',
        label_constraints: 'நகர்வு தடைகள்',
        ph_constraints: 'எ.கா. உள்ளூர் மட்டும்',
        label_emppref: 'வேலை விருப்பம்',
        opt_emp_wage: 'கூலி வேலைவாய்ப்பு',
        opt_emp_self: 'சுய வேலைவாய்ப்பு',
        opt_emp_both: 'இரண்டும்',
        label_region: 'மாவட்டம் / பகுதி',
        ph_region: 'எ.கா. கிராமப்புற சேலம், திருப்பதி',
        btn_submit_reg: '✓ பதிவு செய்து saathi.db-ல் சேமிக்கவும்',
        profiles_title: '👤 பதிவு செய்யப்பட்ட பயனாளிகள்',
        ph_search_profiles: 'பெயர், எண் அல்லது மாவட்டம் மூலம் தேடவும்...',
        empty_select_ben: 'பயனாளி விவரங்களை பார்க்க பட்டியலில் இருந்து தேர்ந்தெடுக்கவும்.',
        label_select_ben: 'பயனாளியை தேர்ந்தெடுக்கவும்:',
        btn_gen_training: '🎯 AI பயிற்சி பரிந்துரைகளை உருவாக்கு',
        empty_training: 'பயனாளியை தேர்ந்தெடுத்து \'AI பயிற்சி பரிந்துரைகளை உருவாக்கு\' கிளிக் செய்யவும்.',
        btn_gen_jobs: '💼 வேலை வாய்ப்புகளை பொருத்துக',
        empty_jobs: 'பயனாளியை தேர்ந்தெடுத்து \'வேலை வாய்ப்புகளை பொருத்துக\' கிளிக் செய்யவும்.',
        btn_view_roadmap_tab: '🗺️ தனிப்பயனாக்கப்பட்ட வரைபடம் பார்',
        empty_roadmap: '6-படி காலவரிசையை காண பயனாளியை தேர்ந்தெடுக்கவும்.',
        subtab_training: 'NSQF அங்கீகரிக்கப்பட்ட பயிற்சி திட்டங்கள்',
        subtab_jobs: 'உள்ளூர் வேலை மற்றும் வாழ்வாதார வாய்ப்புகள்',
        th_prog_name: 'திட்டத்தின் பெயர்',
        th_nsqf_level: 'NSQF நிலை',
        th_emp_type: 'வேலை வகை',
        th_duration: 'கால அளவு',
        th_keywords: 'முக்கிய வார்த்தைகள்',
        th_opp_name: 'வாய்ப்பு பெயர்',
        th_type: 'வகை',
        th_req_skill: 'தேவைப்படும் திறன்',
        th_desc: 'விளக்கம்',
        ob_title: 'பயனாளியை பதிவு செய்க',
        ob_subtitle: 'தகவல் சேகரிக்கும் வழியை தேர்வு செய்யவும்',
        ob_mode_direct_title: 'நேரடி பயன்பாடு',
        ob_mode_direct_desc: 'படிவத்தில் தகவல்களை நேரடியாக தட்டச்சு செய்க',
        ob_badge_text: 'எழுத்து உள்ளீடு',
        ob_mode_voice_title: 'குரல் குறிப்பு பதிவு',
        ob_mode_voice_desc: 'பேசி படிப்படியாக தகவல்களை பதிவு செய்யும் முறை',
        ob_badge_ptt: 'புஷ்-டு-டாக்',
        ob_mode_ivr_title: 'IVR / தொலைபேசி அழைப்பு',
        ob_mode_ivr_desc: 'தொலைபேசி அழைப்பு போன்ற எளிய உரையாடல்',
        ob_badge_ivr: 'IVR அழைப்பு',
        btn_back: '← பின்செல்க',
        ob_lang_title: 'உங்கள் மொழியை தேர்ந்தெடுக்கவும்',
        ob_lang_subtitle: 'அனைத்து கேள்விகளும் உங்கள் மொழியில் இருக்கும்',
        ob_lang_sidebar_title: 'மொழி',
        ob_lang_sidebar_sub: 'எப்போதும் மாற்றலாம்',
        ob_qa_saathi_ai: 'சாதி AI வழிகாட்டப்பட்ட பதிவு',
        ob_tip_speak: 'தெளிவாக பேச பொத்தானை அழுத்திப் பிடிக்கவும்',
        ptt_release_submit: 'பேசி முடித்ததும் விடுவிக்கவும்',
        btn_cancel: '✕ ரத்து',
        ph_type_answer: 'உங்கள் பதிலை இங்கே தட்டச்சு செய்க...',
        btn_next: 'அடுத்து →',
        ptt_hold_speak: 'தட்டவும் / பேச அழுத்திப் பிடிக்கவும்',
        btn_sample_voice: 'மாதிரி பதில்',
        btn_submit_ans: 'சமர்ப்பி →',
        ivr_clear: 'அழி',
        ivr_submit: 'சமர்ப்பி #',
        ob_success_title: 'பதிவு முடிந்தது!',
        ob_success_desc: 'பயனாளி விவரக்குறிப்பு saathi.db-ல் வெற்றிகரமாக சேமிக்கப்பட்டது',
        ob_ben_id_label: 'பயனாளி எண்',
        ob_pipeline_status_label: 'தற்போதைய நிலை',
        btn_view_dash: 'கட்டுப்பாட்டு பலகை பார்',
        btn_reg_another: 'மற்றொரு பயனாளியை பதிவு செய்',
        call_agent_name: 'சாதி AI குரல் அதிகாரி',
        call_state_title: 'மொழி தேர்வு',
        call_state_desc: 'உங்கள் விருப்ப மொழியை தேர்ந்தெடுக்கவும்',
        call_choose_lang_title: 'உங்கள் மொழியை தேர்ந்தெடுக்கவும் / Select Language',
        call_lang_listen: '🎙️ கேட்கிறது… உங்கள் மொழியின் பெயரை சொல்லுங்கள்',
        fallback_title: '⌨️ தட்டச்சு செய்து பதிலளிக்கவும்',
        ph_call_answer: 'உங்கள் பதிலை இங்கே தட்டச்சு செய்க...',
        btn_submit: 'சமர்ப்பி',
        ctrl_replay: 'மீண்டும் கேள்',
        ctrl_type: 'தட்டச்சு',
        ctrl_end_call: 'அழைப்பை முடி',
        prof_modal_title: 'பயனாளி விவரக்குறிப்பு',
        btn_close: 'மூடு',
        btn_view_roadmap: '🗺️ வாழ்வாதார வரைபடம் பார்',
        status_modal_title: 'பயனாளி நிலையை புதுப்பி',
        label_select_status: 'புதிய நிலையை தேர்ந்தெடுக்கவும்:',
        st_created: 'விவரக்குறிப்பு உருவாக்கப்பட்டது',
        st_rec_gen: 'பரிந்துரை உருவாக்கப்பட்டது',
        st_enrolled: 'சேர்க்கப்பட்டார்',
        st_training_prog: 'பயிற்சி நடப்பில் உள்ளது',
        st_training_comp: 'பயிற்சி முடிந்தது',
        st_placed: 'வேலையில் அமர்த்தப்பட்டார்',
        st_self_emp: 'சுயதொழில் தொடங்கப்பட்டது',
        st_hitl: 'அதிகாரி உதவி தேவை (HITL)',
        btn_modal_cancel: 'ரத்து',
        btn_save_status: 'நிலையை சேமிக்கவும்',
        lbl_lang: 'மொழி',
        lbl_phone: 'தொலைபேசி',
        lbl_edu: 'கல்வி தகுதி',
        lbl_curliv: 'தற்போதைய வாழ்வாதாரம்',
        lbl_famocc: 'குடும்ப தொழில்',
        lbl_skills: 'திறன்கள்',
        lbl_interests: 'ஆர்வங்கள்',
        lbl_aspirations: 'விருப்பங்கள்',
        lbl_constraints: 'தடைகள்',
        lbl_emppref: 'வேலை விருப்பம்',
        lbl_region: 'மாவட்டம்',
        lbl_registered: 'பதிவு தேதி',
        btn_full_profile: '👁️ முழு விவரம் பார்க்க',
        btn_update_status: '✏️ நிலையை மாற்று',
        rm_for: 'வாழ்வாதார வரைபடம்:',
        rm_target_prog: 'இலக்கு திட்டம்',
        rm_target_role: 'இலக்கு பணி',
        rm_gaps: 'வளர்க்க வேண்டிய திறன்கள்:',
        rm_no_gaps: 'ஏதுமில்லை (முழு தகுதி பெற்றுள்ளார்!)',
        rm_step1_title: 'படி 1: தற்போதைய திறன் இடைவெளி பகுப்பாய்வு',
        rm_step1_desc: 'பயனாளியின் தற்போதைய திறன்கள்',
        rm_gaps_count: 'முக்கிய திறன்கள் கற்றுக்கொள்ள வேண்டும்',
        rm_step2_title: 'படி 2: பயிற்சி சேர்க்கை -',
        rm_covers: 'கற்பிக்கப்படுபவை',
        rm_step3_title: 'படி 3: வேலைவாய்ப்பு -',
        rm_step3_desc: 'பயிற்சி சான்றிதழுக்கு பின் உள்ளூர் வேலைவாய்ப்புகள் மற்றும் கடன் திட்ட இணைப்பு.',
        rm_completed: '✓ முடிந்தது',
        rm_next_action: '⏳ அடுத்த செயல்',
        rm_upcoming: 'வரவிருக்கும்',
        rm_generating: 'தனிப்பயனாக்கப்பட்ட வரைபடம் உருவாக்கப்படுகிறது...',
        rm_error: 'வரைபடம் உருவாக்க முடியவில்லை.',
        tr_running: 'AI பயிற்சி பரிந்துரை வழிமுறை இயங்குகிறது...',
        tr_no_rec: 'பொருந்தக்கூடிய பயிற்சி திட்டங்கள் இல்லை.',
        tr_match_score: 'பொருத்தம் மதிப்பெண்',
        tr_why_matched: 'ஏன் இந்த திட்டம் பொருத்தப்பட்டது:',
        err_training: 'பரிந்துரைகளை உருவாக்குவதில் பிழை ஏற்பட்டது.',
        jb_matching: 'உள்ளூர் வேலை வாய்ப்புகளுடன் பொருத்துகிறது...',
        jb_no_opp: 'பொருத்தமான வேலைகள் கிடைக்கவில்லை.',
        jb_score: 'மதிப்பெண்',
        jb_criteria: 'பொருந்தும் அளவுகோல்:',
        err_jobs: 'வேலைகளை பொருத்துவதில் பிழை ஏற்பட்டது.',
        alert_select_ben: 'தயவுசெய்து ஒரு பயனாளியை தேர்ந்தெடுக்கவும்.'
    },
    'hi-IN': {
        header_title: 'अधिकारी डैशबोर्ड',
        header_subtitle: 'प्रशिक्षण से रोजगार पाइपलाइन और रीयल-टाइम निगरानी',
        chip_schemes: 'PM-DAKSH और NBCFDC अनुरूप',
        btn_register_beneficiary: '+ लाभार्थी पंजीकृत करें',
        nav_dashboard: 'डैशबोर्ड',
        nav_profiler: 'लाभार्थी प्रोफाइलर',
        nav_training: 'AI प्रशिक्षण इंजन',
        nav_jobs: 'रोजगार और प्लेसमेंट',
        nav_roadmap: 'आजीविका रोडमैप',
        nav_catalogs: 'कार्यक्रम कैटलॉग',
        db_status: 'saathi.db कनेक्टेड',
        gateway_badge: '✨ बहु-माध्यम लाभार्थी प्रवेश',
        gateway_title: 'पंजीकरण मार्ग चुनें',
        gateway_subtitle: 'लाभार्थी की डिजिटल सुविधा के अनुसार सही माध्यम चुनें',
        pill_call: 'इंटरएक्टिव वॉयस एजेंट',
        card_call_title: 'सहायता प्राप्त वॉयस कॉल',
        card_call_desc: 'एक क्लिक में AI वॉयस कॉल शुरू करें। AI अधिकारी हिंदी में प्रश्न पूछेगा और आपकी आवाज से प्रोफाइल बनाएगा।',
        btn_start_ai_call: '🎙️ AI कॉल शुरू करें',
        pill_ptt: 'पुश-टू-टॉक गाइडेड',
        card_ptt_title: 'वॉयस नोट पंजीकरण',
        card_ptt_desc: 'माइक बटन दबाकर बोलें और चरण-दर-चरण अपनी प्रोफाइल आसानी से बनाएं।',
        btn_voice_intake: '🎤 वॉयस पंजीकरण',
        pill_form: 'सीधा फॉर्म',
        card_form_title: 'डायरेक्ट फॉर्म पंजीकरण',
        card_form_desc: 'पारंपरिक पंजीकरण फॉर्म, संपूर्ण हिंदी अनुवाद और स्पष्ट मार्गदर्शन के साथ।',
        btn_open_form: '📋 फॉर्म खोलें',
        metric_total: 'कुल लाभार्थी',
        metric_enrolled: 'प्रशिक्षण में नामांकित',
        metric_placed: 'रोजगार / स्वरोजगार प्राप्त',
        metric_support: 'अधिकारी सहायता अपेक्षित',
        hitl_title: 'मानव सहायता चेतावनी!',
        hitl_desc: 'कुछ लाभार्थियों को अधिकारी सहायता की आवश्यकता है। कृपया समीक्षा करें।',
        btn_filter_support: 'सहायता मामले देखें',
        table_pipeline_title: 'लाभार्थी पाइपलाइन विवरण',
        ph_dash_search: 'नाम, आईडी, क्षेत्र द्वारा खोजें...',
        btn_refresh: 'रिफ्रेश',
        th_id: 'आईडी',
        th_name: 'नाम',
        th_phone: 'फोन नंबर',
        th_region: 'क्षेत्र / जिला',
        th_status: 'पाइपलाइन स्थिति',
        th_date: 'पंजीकरण तिथि',
        th_action: 'कार्रवाई',
        loading_beneficiaries: 'लाभार्थियों की सूची लोड हो रही है...',
        no_beneficiaries: 'डेटाबेस में कोई लाभार्थी नहीं मिला।',
        btn_profile: '👁️ प्रोफाइल',
        btn_status: '✏️ स्थिति',
        reg_form_title: '📋 नया लाभार्थी पंजीकरण',
        btn_voice_demo: '🎤 वॉयस-फिल डेमो (क्लिक करें)',
        label_fullname: 'पूरा नाम *',
        ph_fullname: 'उदा. रमेश कुमार',
        label_phone: 'फोन नंबर *',
        ph_phone: 'उदा. 9876543210',
        label_language: 'बातचीत की भाषा',
        opt_lang_te: 'तेलुगु (Telugu)',
        opt_lang_ta: 'तमिल (Tamil)',
        opt_lang_hi: 'हिंदी (Hindi)',
        opt_lang_kn: 'कन्नड़ (Kannada)',
        opt_lang_en: 'अंग्रेजी (English)',
        label_education: 'शैक्षणिक योग्यता',
        opt_edu_10th: '10वीं उत्तीर्ण',
        opt_edu_12th: '12वीं उत्तीर्ण',
        opt_edu_grad: 'स्नातक (Graduate)',
        opt_edu_iti: 'आईटीआई / डिप्लोमा',
        opt_edu_none: 'अशिक्षित / कोई नहीं',
        label_famocc: 'पारिवारिक / पारंपरिक व्यवसाय',
        ph_famocc: 'उदा. कृषि, बुनाई, चमड़ा कार्य',
        label_curliv: 'वर्तमान आजीविका',
        ph_curliv: 'उदा. दैनिक मजदूर, बेरोजगार',
        label_skills: 'मौजूदा कौशल',
        ph_skills: 'उदा. कंप्यूटर, सिलाई, वायरिंग',
        label_interests: 'रुचि के क्षेत्र',
        ph_interests: 'उदा. फैशन, इलेक्ट्रॉनिक्स, डेटा एंट्री',
        label_aspirations: 'भविष्य की आकांक्षाएं',
        ph_aspirations: 'उदा. छोटा व्यवसाय, तकनीशियन',
        label_constraints: 'गतिशीलता प्रतिबंध',
        ph_constraints: 'उदा. केवल स्थानीय क्षेत्र',
        label_emppref: 'रोजगार प्राथमिकता',
        opt_emp_wage: 'वेतन रोजगार',
        opt_emp_self: 'स्वरोजगार',
        opt_emp_both: 'दोनों',
        label_region: 'क्षेत्र / जिला',
        ph_region: 'उदा. ग्रामीण सलेम, तिरुपति',
        btn_submit_reg: '✓ पंजीकृत करें और saathi.db में सहेजें',
        profiles_title: '👤 पंजीकृत लाभार्थी प्रोफाइल',
        ph_search_profiles: 'नाम, आईडी या क्षेत्र द्वारा खोजें...',
        empty_select_ben: 'प्रोफाइल कार्ड देखने के लिए सूची से किसी लाभार्थी का चयन करें।',
        label_select_ben: 'लाभार्थी चुनें:',
        btn_gen_training: '🎯 AI प्रशिक्षण अनुशंसाएं उत्पन्न करें',
        empty_training: 'लाभार्थी चुनें और \'AI प्रशिक्षण अनुशंसाएं उत्पन्न करें\' पर क्लिक करें।',
        btn_gen_jobs: '💼 रोजगार के अवसर खोजें',
        empty_jobs: 'लाभार्थी चुनें और \'रोजगार के अवसर खोजें\' पर क्लिक करें।',
        btn_view_roadmap_tab: '🗺️ व्यक्तिगत आजीविका रोडमैप देखें',
        empty_roadmap: '6-चरणीय आजीविका समयरेखा देखने के लिए लाभार्थी का चयन करें।',
        subtab_training: 'NSQF संरेखित प्रशिक्षण कार्यक्रम',
        subtab_jobs: 'स्थानीय रोजगार और आजीविका के अवसर',
        th_prog_name: 'कार्यक्रम का नाम',
        th_nsqf_level: 'NSQF स्तर',
        th_emp_type: 'रोजगार प्रकार',
        th_duration: 'अवधि',
        th_keywords: 'मुख्य शब्द',
        th_opp_name: 'अवसर का नाम',
        th_type: 'प्रकार',
        th_req_skill: 'आवश्यक कौशल',
        th_desc: 'विवरण',
        ob_title: 'लाभार्थी पंजीकृत करें',
        ob_subtitle: 'जानकारी एकत्र करने का तरीका चुनें',
        ob_mode_direct_title: 'सीधा ऐप उपयोग',
        ob_mode_direct_desc: 'संवादात्मक फॉर्म में चरणबद्ध उत्तर टाइप करें',
        ob_badge_text: 'टेक्स्ट इनपुट',
        ob_mode_voice_title: 'वॉयस नोट पंजीकरण',
        ob_mode_voice_desc: 'पुश-टू-टॉक बोलकर आसान पंजीकरण विधि',
        ob_badge_ptt: 'पुश-टू-टॉक',
        ob_mode_ivr_title: 'IVR / फोन कॉल',
        ob_mode_ivr_desc: 'टेलीफोन कॉल सिमुलेशन वार्तालाप',
        ob_badge_ivr: 'IVR कॉल',
        btn_back: '← पीछे जाएं',
        ob_lang_title: 'अपनी भाषा चुनें',
        ob_lang_subtitle: 'सभी प्रश्न आपकी चुनी हुई भाषा में पूछे जाएंगे',
        ob_lang_sidebar_title: 'भाषा',
        ob_lang_sidebar_sub: 'कभी भी बदलें',
        ob_qa_saathi_ai: 'साथी AI निर्देशित पंजीकरण',
        ob_tip_speak: 'स्पष्ट रूप से बोलने के लिए बटन दबाकर रखें',
        ptt_release_submit: 'बोलना समाप्त होने पर छोड़ें',
        btn_cancel: '✕ रद्द करें',
        ph_type_answer: 'अपना उत्तर यहाँ लिखें...',
        btn_next: 'आगे →',
        ptt_hold_speak: 'टैप करें / बोलने के लिए दबाए रखें',
        btn_sample_voice: 'नमूना उत्तर',
        btn_submit_ans: 'जमा करें →',
        ivr_clear: 'साफ करें',
        ivr_submit: 'जमा करें #',
        ob_success_title: 'पंजीकरण पूर्ण हुआ!',
        ob_success_desc: 'लाभार्थी प्रोफाइल तैयार होकर saathi.db में सुरक्षित हो गई है',
        ob_ben_id_label: 'लाभार्थी आईडी',
        ob_pipeline_status_label: 'पाइपलाइन स्थिति',
        btn_view_dash: 'डैशबोर्ड देखें',
        btn_reg_another: 'एक और लाभार्थी जोड़ें',
        call_agent_name: 'साथी AI वॉयस अधिकारी',
        call_state_title: 'भाषा चयन',
        call_state_desc: 'कृपया अपनी पसंदीदा भाषा चुनें',
        call_choose_lang_title: 'अपनी भाषा चुनें / Select Language',
        call_lang_listen: '🎙️ सुन रहे हैं… अपनी भाषा का नाम बोलें',
        fallback_title: '⌨️ लिखकर उत्तर दें',
        ph_call_answer: 'अपना उत्तर यहाँ लिखें...',
        btn_submit: 'जमा करें',
        ctrl_replay: 'पुनः सुनें',
        ctrl_type: 'टाइप करें',
        ctrl_end_call: 'कॉल समाप्त करें',
        prof_modal_title: 'लाभार्थी प्रोफाइल',
        btn_close: 'बंद करें',
        btn_view_roadmap: '🗺️ व्यक्तिगत रोडमैप देखें',
        status_modal_title: 'पाइपलाइन स्थिति अपडेट करें',
        label_select_status: 'नई स्थिति चुनें:',
        st_created: 'प्रोफ़ाइल बनाई गई',
        st_rec_gen: 'अनुशंसा उत्पन्न की गई',
        st_enrolled: 'नामांकित',
        st_training_prog: 'प्रशिक्षण प्रगति पर',
        st_training_comp: 'प्रशिक्षण पूर्ण',
        st_placed: 'रोजगार प्राप्त',
        st_self_emp: 'स्वरोजगार प्रारंभ',
        st_hitl: 'अधिकारी सहायता अपेक्षित (HITL)',
        btn_modal_cancel: 'रद्द करें',
        btn_save_status: 'स्थिति saathi.db में सहेजें',
        lbl_lang: 'भाषा',
        lbl_phone: 'फोन नंबर',
        lbl_edu: 'शिक्षा',
        lbl_curliv: 'वर्तमान आजीविका',
        lbl_famocc: 'पारिवारिक व्यवसाय',
        lbl_skills: 'कौशल',
        lbl_interests: 'रुचि',
        lbl_aspirations: 'आकांक्षाएं',
        lbl_constraints: 'प्रतिबंध',
        lbl_emppref: 'रोजगार प्राथमिकता',
        lbl_region: 'क्षेत्र',
        lbl_registered: 'पंजीकरण तिथि',
        btn_full_profile: '👁️ संपूर्ण प्रोफाइल देखें',
        btn_update_status: '✏️ स्थिति अपडेट करें',
        rm_for: 'आजीविका रोडमैप:',
        rm_target_prog: 'लक्ष्य कार्यक्रम',
        rm_target_role: 'लक्ष्य पद',
        rm_gaps: 'विकसित किए जाने वाले कौशल:',
        rm_no_gaps: 'कोई नहीं (पूर्ण योग्य!)',
        rm_step1_title: 'चरण 1: कौशल विश्लेषण और आधारभूत मूल्यांकन',
        rm_step1_desc: 'लाभार्थी के पास मौजूदा कौशल',
        rm_gaps_count: 'महत्वपूर्ण कौशल सीखने की आवश्यकता है',
        rm_step2_title: 'चरण 2: प्रशिक्षण में नामांकन -',
        rm_covers: 'सिखाए जाने वाले विषय',
        rm_step3_title: 'चरण 3: रोजगार / स्वरोजगार स्थापना -',
        rm_step3_desc: 'प्रमाणपत्र के बाद स्थानीय नियोक्ताओं और ऋण योजनाओं से जुड़ाव।',
        rm_completed: '✓ पूर्ण',
        rm_next_action: '⏳ अगली कार्रवाई',
        rm_upcoming: 'आगामी',
        rm_generating: 'व्यक्तिगत आजीविका रोडमैप तैयार हो रहा है...',
        rm_error: 'रोडमैप तैयार करने में असमर्थ।',
        tr_running: 'AI प्रशिक्षण अनुशंसा एल्गोरिदम चल रहा है...',
        tr_no_rec: 'कोई उपयुक्त प्रशिक्षण कार्यक्रम नहीं मिला।',
        tr_match_score: 'मैच स्कोर',
        tr_why_matched: 'यह कार्यक्रम क्यों चुना गया:',
        err_training: 'अनुशंसाएं उत्पन्न करने में त्रुटि हुई।',
        jb_matching: 'स्थानीय अवसरों से मिलान किया जा रहा है...',
        jb_no_opp: 'कोई उपयुक्त अवसर नहीं मिला।',
        jb_score: 'स्कोर',
        jb_criteria: 'मिलान मानदंड:',
        err_jobs: 'रोजगार मिलान में त्रुटि हुई।',
        alert_select_ben: 'कृपया किसी लाभार्थी का चयन करें।'
    },
    'kn-IN': {
        header_title: 'ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        header_subtitle: 'ತರಬೇತಿಯಿಂದ ಉದ್ಯೋಗದವರೆಗೆ ನೈಜ ಸಮಯದ ಮೇಲ್ವಿಚಾರಣೆ',
        chip_schemes: 'PM-DAKSH ಮತ್ತು NBCFDC ಅನುರೂಪ',
        btn_register_beneficiary: '+ ಫಲಾನುಭವಿ ನೋಂದಣಿ',
        nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        nav_profiler: 'ಫಲಾನುಭವಿ ಪ್ರೊಫೈಲರ್',
        nav_training: 'AI ತರಬೇತಿ ಎಂಜಿನ್',
        nav_jobs: 'ಉದ್ಯೋಗ ಮತ್ತು ನಿಯೋಜನೆ',
        nav_roadmap: 'ಜೀವನೋಪಾಯ ಮಾರ್ಗಸೂಚಿ',
        nav_catalogs: 'ಕಾರ್ಯಕ್ರಮ ಕ್ಯಾಟಲಾಗ್‌ಗಳು',
        db_status: 'saathi.db ಸಂಪರ್ಕಗೊಂಡಿದೆ',
        gateway_badge: '✨ ಬಹು-ಮಾದರಿ ಫಲಾನುಭವಿ ನೋಂದಣಿ',
        gateway_title: 'ನೋಂದಣಿ ಮಾರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        gateway_subtitle: 'ಫಲಾನುಭವಿಯ ಅನುಕೂಲಕ್ಕೆ ತಕ್ಕಂತೆ ನೋಂದಣಿ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        pill_call: 'ಇಂಟರ್ಯಾಕ್ಟಿವ್ ವಾಯ್ಸ್ ಏಜೆಂಟ್',
        card_call_title: 'AI ಧ್ವನಿ ಕರೆ ನೆರವು',
        card_call_desc: 'ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಧ್ವನಿ ಕರೆ. AI ಅಧಿಕಾರಿಯು ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಮಾಹಿತಿ ದಾಖಲಿಸುತ್ತಾರೆ.',
        btn_start_ai_call: '🎙️ AI ಕರೆ ಪ್ರಾರಂಭಿಸಿ',
        pill_ptt: 'ಪುಶ್-ಟು-ಟಾಕ್ ಮಾರ್ಗದರ್ಶಿ',
        card_ptt_title: 'ಧ್ವನಿ ಟಿಪ್ಪಣಿ ನೋಂದಣಿ',
        card_ptt_desc: 'ಮೈಕ್ ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಿ ಹಂತ ಹಂತವಾಗಿ ಸುಲಭವಾಗಿ ನೋಂದಾಯಿಸಿ.',
        btn_voice_intake: '🎤 ಧ್ವನಿ ನೋಂದಣಿ',
        pill_form: 'ನೇರ ನಮೂನೆ',
        card_form_title: 'ನೇರ ನಮೂನೆ ನೋಂದಣಿ',
        card_form_desc: 'ಸಾಂಪ್ರದಾಯಿಕ ನೋಂದಣಿ ನಮೂನೆ, ಸಂಪೂರ್ಣ ಕನ್ನಡ ಅನುವಾದದೊಂದಿಗೆ.',
        btn_open_form: '📋 ನಮೂನೆ ತೆರೆಯಿರಿ',
        metric_total: 'ಒಟ್ಟು ಫಲಾನುಭವಿಗಳು',
        metric_enrolled: 'ತರಬೇತಿಯಲ್ಲಿರುವವರು',
        metric_placed: 'ಉದ್ಯೋಗ ಪಡೆದವರು',
        metric_support: 'ಅಧಿಕಾರಿ ಬೆಂಬಲ ಅಗತ್ಯವಿರುವವರು',
        hitl_title: 'ಅಧಿಕಾರಿ ನೆರವು ಎಚ್ಚರಿಕೆ!',
        hitl_desc: 'ಕೆಲವು ಫಲಾನುಭವಿಗಳಿಗೆ ಅಧಿಕಾರಿ ನೆರವು ಅಗತ್ಯವಿದೆ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.',
        btn_filter_support: 'ನೆರವು ಪ್ರಕರಣಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ',
        table_pipeline_title: 'ಫಲಾನುಭವಿ ಪೈಪ್‌ಲೈನ್ ಅವಲೋಕನ',
        ph_dash_search: 'ಹೆಸರು, ಐಡಿ, ಪ್ರದೇಶದ ಮೂಲಕ ಹುಡುಕಿ...',
        btn_refresh: 'ತಾಜಾಗೊಳಿಸಿ',
        th_id: 'ಐಡಿ',
        th_name: 'ಹೆಸರು',
        th_phone: 'ದೂರವಾಣಿ',
        th_region: 'ಪ್ರದೇಶ / ಜಿಲ್ಲೆ',
        th_status: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
        th_date: 'ನೋಂದಣಿ ದಿನಾಂಕ',
        th_action: 'ಕ್ರಮ',
        loading_beneficiaries: 'ಫಲಾನುಭವಿಗಳ ವಿವರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        no_beneficiaries: 'ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಫಲಾನುಭವಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
        btn_profile: '👁️ ಪ್ರೊಫೈಲ್',
        btn_status: '✏️ ಸ್ಥಿತಿ',
        reg_form_title: '📋 ಹೊಸ ಫಲಾನುಭವಿ ನೋಂದಣಿ',
        btn_voice_demo: '🎤 ಧ್ವನಿ-ತುಂಬುವ ಡೆಮೊ (ಕ್ಲಿಕ್ ಮಾಡಿ)',
        label_fullname: 'ಪೂರ್ಣ ಹೆಸರು *',
        ph_fullname: 'ಉದಾ. ರಮೇಶ್ ಕುಮಾರ್',
        label_phone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ *',
        ph_phone: 'ಉದಾ. 9876543210',
        label_language: 'ಸಂವಾದ ಭಾಷೆ',
        opt_lang_te: 'ತೆಲುಗು (Telugu)',
        opt_lang_ta: 'ತಮಿಳು (Tamil)',
        opt_lang_hi: 'ಹಿಂದಿ (Hindi)',
        opt_lang_kn: 'ಕನ್ನಡ (Kannada)',
        opt_lang_en: 'ಇಂಗ್ಲಿಷ್ (English)',
        label_education: 'ವಿದ್ಯಾರ್ಹತೆ',
        opt_edu_10th: '10ನೇ ತರಗತಿ ಉತ್ತೀರ್ಣ',
        opt_edu_12th: '12ನೇ ತರಗತಿ ಉತ್ತೀರ್ಣ',
        opt_edu_grad: 'ಪದವೀಧರ (Graduate)',
        opt_edu_iti: 'ಐಟಿಐ / ಡಿಪ್ಲೊಮಾ',
        opt_edu_none: 'ಅನಕ್ಷರಸ್ಥ / ಇಲ್ಲ',
        label_famocc: 'ಕುಟುಂಬ / ಸಾಂಪ್ರದಾಯಿಕ ಉದ್ಯೋಗ',
        ph_famocc: 'ಉದಾ. ಕೃಷಿ, ನೇಯ್ಗೆ, ಚರ್ಮದ ಕೆಲಸ',
        label_curliv: 'ಪ್ರಸ್ತುತ ಜೀವನೋಪಾಯ',
        ph_curliv: 'ಉದಾ. ದಿನಗೂಲಿ, ನಿರುದ್ಯೋಗಿ',
        label_skills: 'ಹಾಲಿ ಕೌಶಲ್ಯಗಳು',
        ph_skills: 'ಉದಾ. ಕಂಪ್ಯೂಟರ್, ಹೊಲಿಗೆ, ವೈರಿಂಗ್',
        label_interests: 'ಆಸಕ್ತಿಯ ಕ್ಷೇತ್ರಗಳು',
        ph_interests: 'ಉದಾ. ಫ್ಯಾಷನ್, ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್',
        label_aspirations: 'ಭವಿಷ್ಯದ ಆಕಾಂಕ್ಷೆಗಳು',
        ph_aspirations: 'ಉದಾ. ಸಣ್ಣ ವ್ಯಾಪಾರ, ತಂತ್ರಜ್ಞ',
        label_constraints: 'ಚಲನಶೀಲತೆಯ ನಿರ್ಬಂಧಗಳು',
        ph_constraints: 'ಉದಾ. ಸ್ಥಳೀಯ ಪ್ರದೇಶ ಮಾತ್ರ',
        label_emppref: 'ಉದ್ಯೋಗ ಆದ್ಯತೆ',
        opt_emp_wage: 'ವೇತನ ಉದ್ಯೋಗ',
        opt_emp_self: 'ಸ್ವಯಂ ಉದ್ಯೋಗ',
        opt_emp_both: 'ಎರಡೂ',
        label_region: 'ಪ್ರದೇಶ / ಜಿಲ್ಲೆ',
        ph_region: 'ಉದಾ. ಗ್ರಾಮೀಣ ಸೇಲಂ, ತಿರುಪತಿ',
        btn_submit_reg: '✓ ನೋಂದಾಯಿಸಿ ಮತ್ತು saathi.db ಯಲ್ಲಿ ಉಳಿಸಿ',
        profiles_title: '👤 ನೋಂದಾಯಿತ ಫಲಾನುಭವಿ ಪ್ರೊಫೈಲ್‌ಗಳು',
        ph_search_profiles: 'ಹೆಸರು, ಐಡಿ ಅಥವಾ ಪ್ರದೇಶದ ಮೂಲಕ ಹುಡುಕಿ...',
        empty_select_ben: 'ಪ್ರೊಫೈಲ್ ಕಾರ್ಡ್ ನೋಡಲು ಪಟ್ಟಿಯಿಂದ ಫಲಾನುಭವಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        label_select_ben: 'ಫಲಾನುಭವಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
        btn_gen_training: '🎯 AI ತರಬೇತಿ ಶಿಫಾರಸುಗಳನ್ನು ರಚಿಸಿ',
        empty_training: 'ಫಲಾನುಭವಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು \'AI ತರಬೇತಿ ಶಿಫಾರಸುಗಳನ್ನು ರಚಿಸಿ\' ಕ್ಲಿಕ್ ಮಾಡಿ.',
        btn_gen_jobs: '💼 ಉದ್ಯೋಗಾವಕಾಶಗಳನ್ನು ಹೊಂದಿಸಿ',
        empty_jobs: 'ಫಲಾನುಭವಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು \'ಉದ್ಯೋಗಾವಕಾಶಗಳನ್ನು ಹೊಂದಿಸಿ\' ಕ್ಲಿಕ್ ಮಾಡಿ.',
        btn_view_roadmap_tab: '🗺️ ವೈಯಕ್ತಿಕ ಜೀವನೋಪಾಯ ಮಾರ್ಗಸೂಚಿ ವೀಕ್ಷಿಸಿ',
        empty_roadmap: '6-ಹಂತಗಳ ಜೀವನೋಪಾಯ ಸಮಯರೇಖೆಯನ್ನು ವೀಕ್ಷಿಸಲು ಫಲಾನುಭವಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        subtab_training: 'NSQF ಅನುಮೋದಿತ ತರಬೇತಿ ಕಾರ್ಯಕ್ರಮಗಳು',
        subtab_jobs: 'ಸ್ಥಳೀಯ ಉದ್ಯೋಗ ಮತ್ತು ಜೀವನೋಪಾಯದ ಅವಕಾಶಗಳು',
        th_prog_name: 'ಕಾರ್ಯಕ್ರಮದ ಹೆಸರು',
        th_nsqf_level: 'NSQF ಮಟ್ಟ',
        th_emp_type: 'ಉದ್ಯೋಗದ ಪ್ರಕಾರ',
        th_duration: 'ಅವಧಿ',
        th_keywords: 'ಪ್ರಮುಖ ಪದಗಳು',
        th_opp_name: 'ಅವಕಾಶದ ಹೆಸರು',
        th_type: 'ಪ್ರಕಾರ',
        th_req_skill: 'ಅಗತ್ಯವಿರುವ ಕೌಶಲ್ಯ',
        th_desc: 'ವಿವರಣೆ',
        ob_title: 'ಫಲಾನುಭವಿ ನೋಂದಣಿ',
        ob_subtitle: 'ಮಾಹಿತಿ ಸಂಗ್ರಹಿಸುವ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        ob_mode_direct_title: 'ನೇರ ಅಪ್ಲಿಕೇಶನ್ ಬಳಕೆ',
        ob_mode_direct_desc: 'ಫಾರ್ಮ್‌ನಲ್ಲಿ ಉತ್ತರಗಳನ್ನು ನೇರವಾಗಿ ಟೈಪ್ ಮಾಡಿ',
        ob_badge_text: 'ಪಠ್ಯ ನಮೂದು',
        ob_mode_voice_title: 'ಧ್ವನಿ ಟಿಪ್ಪಣಿ ನೋಂದಣಿ',
        ob_mode_voice_desc: 'ಮಾತನಾಡಿ ಹಂತ ಹಂತವಾಗಿ ಸುಲಭವಾಗಿ ನೋಂದಾಯಿಸಿ',
        ob_badge_ptt: 'ಪುಶ್-ಟು-ಟಾಕ್',
        ob_mode_ivr_title: 'IVR / ಫೋನ್ ಕರೆ',
        ob_mode_ivr_desc: 'ದೂರವಾಣಿ ಕರೆ ಸಂಭಾಷಣೆ ವಿಧಾನ',
        ob_badge_ivr: 'IVR ಕರೆ',
        btn_back: '← ಹಿಂದಕ್ಕೆ',
        ob_lang_title: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        ob_lang_subtitle: 'ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು ನಿಮ್ಮ ಆಯ್ಕೆಯ ಭಾಷೆಯಲ್ಲಿರುತ್ತವೆ',
        ob_lang_sidebar_title: 'ಭಾಷೆ',
        ob_lang_sidebar_sub: 'ಯಾವಾಗ ಬೇಕಾದರೂ ಬದಲಾಯಿಸಿ',
        ob_qa_saathi_ai: 'ಸಾಥಿ AI ಮಾರ್ಗದರ್ಶನದ ನೋಂದಣಿ',
        ob_tip_speak: 'ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಲು ಬಟನ್ ಒತ್ತಿ ಹಿಡಿಯಿರಿ',
        ptt_release_submit: 'ಮಾತನಾಡಿ ಮುಗಿದ ನಂತರ ಬಿಡಿ',
        btn_cancel: '✕ ರದ್ದು',
        ph_type_answer: 'ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...',
        btn_next: 'ಮುಂದೆ →',
        ptt_hold_speak: 'ಟ್ಯಾಪ್ ಮಾಡಿ / ಮಾತನಾಡಲು ಒತ್ತಿ ಹಿಡಿಯಿರಿ',
        btn_sample_voice: 'ಮಾದರಿ ಉತ್ತರ',
        btn_submit_ans: 'ಸಲ್ಲಿಸಿ →',
        ivr_clear: 'ತೆರವುಗೊಳಿಸಿ',
        ivr_submit: 'ಸಲ್ಲಿಸಿ #',
        ob_success_title: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಂಡಿದೆ!',
        ob_success_desc: 'ಫಲಾನುಭವಿ ಪ್ರೊಫೈಲ್ ರಚಿಸಲಾಗಿದೆ ಮತ್ತು saathi.db ಯಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ',
        ob_ben_id_label: 'ಫಲಾನುಭವಿ ಐಡಿ',
        ob_pipeline_status_label: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
        btn_view_dash: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ವೀಕ್ಷಿಸಿ',
        btn_reg_another: 'ಇನ್ನೊಬ್ಬರನ್ನು ನೋಂದಾಯಿಸಿ',
        call_agent_name: 'ಸಾಥಿ AI ಧ್ವನಿ ಅಧಿಕಾರಿ',
        call_state_title: 'ಭಾಷೆ ಆಯ್ಕೆ',
        call_state_desc: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        call_choose_lang_title: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language',
        call_lang_listen: '🎙️ ಆಲಿಸಲಾಗುತ್ತಿದೆ… ನಿಮ್ಮ ಭಾಷೆಯ ಹೆಸರನ್ನು ಹೇಳಿ',
        fallback_title: '⌨️ ಟೈಪ್ ಮಾಡಿ ಉತ್ತರಿಸಿ',
        ph_call_answer: 'ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...',
        btn_submit: 'ಸಲ್ಲಿಸಿ',
        ctrl_replay: 'ಮತ್ತೆ ಕೇಳಿ',
        ctrl_type: 'ಟೈಪ್ ಮಾಡಿ',
        ctrl_end_call: 'ಕರೆ ಮುಗಿಸಿ',
        prof_modal_title: 'ಫಲಾನುಭವಿ ಪ್ರೊಫೈಲ್',
        btn_close: 'ಮುಚ್ಚಿ',
        btn_view_roadmap: '🗺️ ಜೀವನೋಪಾಯ ಮಾರ್ಗಸೂಚಿ ವೀಕ್ಷಿಸಿ',
        status_modal_title: 'ಪೈಪ್‌ಲೈನ್ ಸ್ಥಿತಿ ನವೀಕರಿಸಿ',
        label_select_status: 'ಹೊಸ ಸ್ಥಿತಿ ಆಯ್ಕೆಮಾಡಿ:',
        st_created: 'ಪ್ರೊಫೈಲ್ ರಚಿಸಲಾಗಿದೆ',
        st_rec_gen: 'ಶಿಫಾರಸು ಸಿದ್ಧಗೊಂಡಿದೆ',
        st_enrolled: 'ದಾಖಲಿಸಲಾಗಿದೆ',
        st_training_prog: 'ತರಬೇತಿ ಪ್ರಗತಿಯಲ್ಲಿದೆ',
        st_training_comp: 'ತರಬೇತಿ ಪೂರ್ಣಗೊಂಡಿದೆ',
        st_placed: 'ಉದ್ಯೋಗ ನಿಯೋಜನೆಗೊಂಡಿದೆ',
        st_self_emp: 'ಸ್ವಯಂ ಉದ್ಯೋಗ ಆರಂಭಿಸಲಾಗಿದೆ',
        st_hitl: 'ಅಧಿಕಾರಿ ನೆರವು ಅಗತ್ಯವಿದೆ (HITL)',
        btn_modal_cancel: 'ರದ್ದು',
        btn_save_status: 'ಸ್ಥಿತಿಯನ್ನು saathi.db ಯಲ್ಲಿ ಉಳಿಸಿ',
        lbl_lang: 'ಭಾಷೆ',
        lbl_phone: 'ದೂರವಾಣಿ',
        lbl_edu: 'ವಿದ್ಯಾರ್ಹತೆ',
        lbl_curliv: 'ಪ್ರಸ್ತುತ ಜೀವನೋಪಾಯ',
        lbl_famocc: 'ಕುಟುಂಬದ ಉದ್ಯೋಗ',
        lbl_skills: 'ಕೌಶಲ್ಯಗಳು',
        lbl_interests: 'ಆಸಕ್ತಿಗಳು',
        lbl_aspirations: 'ಆಕಾಂಕ್ಷೆಗಳು',
        lbl_constraints: 'ನಿರ್ಬಂಧಗಳು',
        lbl_emppref: 'ಉದ್ಯೋಗ ಆದ್ಯತೆ',
        lbl_region: 'ಪ್ರದೇಶ',
        lbl_registered: 'ನೋಂದಣಿ ದಿನಾಂಕ',
        btn_full_profile: '👁️ ಪೂರ್ಣ ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ',
        btn_update_status: '✏️ ಸ್ಥಿತಿ ನವೀಕರಿಸಿ',
        rm_for: 'ಜೀವನೋಪಾಯ ಮಾರ್ಗಸೂಚಿ:',
        rm_target_prog: 'ಗುರಿ ಕಾರ್ಯಕ್ರಮ',
        rm_target_role: 'ಗುರಿ ಪಾತ್ರ',
        rm_gaps: 'ಕಲಿಯಬೇಕಾದ ಕೌಶಲ್ಯಗಳು:',
        rm_no_gaps: 'ಯಾವುದೂ ಇಲ್ಲ (ಸಂಪೂರ್ಣ ಅರ್ಹತೆ ಹೊಂದಿದ್ದಾರೆ!)',
        rm_step1_title: 'ಹಂತ 1: ಕೌಶಲ್ಯ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಬೇಸ್‌ಲೈನ್',
        rm_step1_desc: 'ಫಲಾನುಭವಿಯ ಹಾಲಿ ಕೌಶಲ್ಯಗಳು',
        rm_gaps_count: 'ಪ್ರಮುಖ ಕೌಶಲ್ಯಗಳನ್ನು ಕಲಿಯಬೇಕಾಗಿದೆ',
        rm_step2_title: 'ಹಂತ 2: ತರಬೇತಿಗೆ ಸೇರ್ಪಡೆ -',
        rm_covers: 'ಕಲಿಸಲಾಗುವ ವಿಷಯಗಳು',
        rm_step3_title: 'ಹಂತ 3: ಉದ್ಯೋಗ ನಿಯೋಜನೆ -',
        rm_step3_desc: 'ಪ್ರಮಾಣೀಕರಣದ ನಂತರ ಸ್ಥಳೀಯ ಉದ್ಯೋಗದಾತರು ಮತ್ತು ಕ್ರೆಡಿಟ್ ಯೋಜನೆಗಳ ಸಂಪರ್ಕ.',
        rm_completed: '✓ ಪೂರ್ಣಗೊಂಡಿದೆ',
        rm_next_action: '⏳ ಮುಂದಿನ ಕ್ರಮ',
        rm_upcoming: 'ಮುಂಬರುವ',
        rm_generating: 'ವೈಯಕ್ತಿಕ ಜೀವನೋಪಾಯ ಮಾರ್ಗಸೂಚಿ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...',
        rm_error: 'ಮಾರ್ಗಸೂಚಿ ಸಿದ್ಧಪಡಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.',
        tr_running: 'AI ತರಬೇತಿ ಶಿಫಾರಸು ಅಲ್ಗಾರಿದಮ್ ಚಾಲನೆಯಲ್ಲಿದೆ...',
        tr_no_rec: 'ಯಾವುದೇ ಸೂಕ್ತ ತರಬೇತಿ ಕಾರ್ಯಕ್ರಮಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
        tr_match_score: 'ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್',
        tr_why_matched: 'ಈ ಕಾರ್ಯಕ್ರಮವನ್ನು ಏಕೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ:',
        err_training: 'ಶಿಫಾರಸುಗಳನ್ನು ರಚಿಸುವಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ.',
        jb_matching: 'ಸ್ಥಳೀಯ ಅವಕಾಶಗಳೊಂದಿಗೆ ಹೊಂದಿಸಲಾಗುತ್ತಿದೆ...',
        jb_no_opp: 'ಸೂಕ್ತ ಉದ್ಯೋಗಾವಕಾಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
        jb_score: 'ಸ್ಕೋರ್',
        jb_criteria: 'ಹೊಂದಾಣಿಕೆ ಮಾನದಂಡ:',
        err_jobs: 'ಉದ್ಯೋಗಗಳನ್ನು ಹೊಂದಿಸುವಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ.',
        alert_select_ben: 'ದಯವಿಟ್ಟು ಫಲಾನುಭವಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.'
    }
};

// =============================================================================
// SPEECH SYNTHESIS ENGINE — Gemini TTS primary, browser TTS fallback
// =============================================================================
let _ttsWatchdog = null;
let _ttsAudioCtx  = null;  // Web Audio context (reused)
let _ttsSpeakTimer = null; // Pending speak() timer — cleared on new calls to prevent races

function _getAudioCtx() {
    if (!_ttsAudioCtx || _ttsAudioCtx.state === 'closed') {
        _ttsAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return _ttsAudioCtx;
}

/**
 * Play base64 audio (MP3/WAV) using HTML5 Audio element.
 * Fallback to browser TTS if audio playback fails.
 */
function _playBase64Audio(base64, onEndCallback, fallbackText, fallbackLang) {
    try {
        if (window._currentPlayingAudio) {
            try { window._currentPlayingAudio.pause(); } catch(e){}
            window._currentPlayingAudio = null;
        }

        const mime = (base64.startsWith('UklGR') || base64.startsWith('RIFF')) ? 'audio/wav' : 'audio/mp3';
        const audio = new Audio(`data:${mime};base64,` + base64);
        window._currentPlayingAudio = audio;

        let callbackFired = false;
        const fireCallback = () => {
            if (callbackFired) return;
            callbackFired = true;
            window._currentPlayingAudio = null;
            if (onEndCallback) onEndCallback();
        };

        audio.onended = fireCallback;
        audio.onerror = (err) => {
            console.warn('[TTS] Natural Audio play error, falling back to browser TTS:', err);
            if (fallbackText) _browserSpeak(fallbackText, fallbackLang || 'en-IN', onEndCallback);
            else fireCallback();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('[TTS] ▶ Playing natural studio voice audio');
            }).catch((err) => {
                console.warn('[TTS] Audio.play() blocked/interrupted, falling back:', err);
                if (fallbackText) _browserSpeak(fallbackText, fallbackLang || 'en-IN', onEndCallback);
                else fireCallback();
            });
        }
    } catch (e) {
        console.warn('[TTS] _playBase64Audio exception, falling back:', e);
        if (fallbackText) _browserSpeak(fallbackText, fallbackLang || 'en-IN', onEndCallback);
        else if (onEndCallback) onEndCallback();
    }
}

/**
 * Clean & prepare text for smooth, natural speech.
 * Expands technical abbreviations, cleans markdown/emojis, and inserts natural cadence pauses.
 */
function _cleanTextForSpeech(text) {
    if (!text) return '';
    let t = text
        .replace(/[*_#`~[\]()]/g, ' ')      // Remove markdown formatting
        .replace(/[\u{1F300}-\u{1FAFF}]/gu, '') // Remove emojis
        .replace(/https?:\/\/\S+/g, '')     // Remove URLs
        .replace(/\bNSQF\s*L(\d)/gi, 'NSQF Level $1')
        .replace(/\b(\d+)\s*mo\b/gi, '$1 months')
        .replace(/\bSHG\b/g, 'Self Help Group')
        .replace(/\bSC\/ST\b/g, 'Scheduled Caste and Scheduled Tribe')
        .replace(/\bPM-DAKSH\b/g, 'P M Daksh')
        .replace(/\bNBCFDC\b/g, 'N B C F D C')
        .replace(/\bRs\.?\s*(\d+)/gi, '$1 Rupees')
        .replace(/₹\s*(\d+)/g, '$1 Rupees')
        .replace(/\s+/g, ' ')
        .trim();

    // Ensure polite pause between sentences
    t = t.replace(/([.!?।॥])\s*/g, '$1 , ');
    return t;
}

window._activeUtterances = [];

/**
 * Select the highest quality smooth, clear Male voice available in the browser/OS.
 */
function _selectBestMaleVoice(voices, lang) {
    if (!voices || voices.length === 0) return null;
    const l = (lang || 'en-IN').toLowerCase();
    const prefix = l.split('-')[0];

    // Priority list of premium natural male voices across OS (macOS, Windows, Chrome OS, Android)
    const preferredMaleNames = [
        'Rishi',                   // Indian English Male (macOS) - Warm & Clear
        'Google UK English Male',  // Chrome Natural UK Male
        'Google US English Male',  // Chrome Natural US Male
        'Daniel',                  // Premium UK English Male (macOS / Windows)
        'Alex',                    // Clear, smooth macOS Male
        'Hemant',                  // Indian Hindi Male
        'Google हिन्दी',          // Chrome Hindi Natural
        'Microsoft Ravi',          // Windows Indian English Male
        'Microsoft David',         // Windows US Male
        'Microsoft George',        // Windows UK Male
        'Arthur',                  // British Male
        'Oliver',                  // British Male
        'Guy',                     // US Male
        'Mark'                     // US Male
    ];

    // 1. Check if preferred male voice is present for this language or English
    for (const name of preferredMaleNames) {
        const found = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
        if (found) {
            if (prefix === 'hi' && (found.lang.includes('hi') || found.name.includes('हिन्दी') || found.name.includes('Hemant'))) {
                return found;
            }
            if (prefix === 'en') {
                return found;
            }
        }
    }

    // 2. Search for any voice marked "Male" matching language
    const langMale = voices.find(v => (v.lang.toLowerCase() === l || v.lang.toLowerCase().startsWith(prefix))
                                   && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man')));
    if (langMale) return langMale;

    // 3. Search for any matching voice for this language
    const langMatch = voices.find(v => v.lang.toLowerCase() === l)
                   || voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (langMatch) return langMatch;

    // 4. Default to standard clear male voice
    return voices.find(v => v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('Rishi')) || voices[0];
}

/**
 * _browserSpeak — Instant, zero-lag, smooth and clear male voice playback.
 */
function _browserSpeak(text, lang, onEndCallback) {
    if (!('speechSynthesis' in window)) { if (onEndCallback) onEndCallback(); return; }

    if (_ttsSpeakTimer) { clearTimeout(_ttsSpeakTimer); _ttsSpeakTimer = null; }
    if (_ttsWatchdog)   { clearTimeout(_ttsWatchdog);   _ttsWatchdog = null; }

    try {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        window.speechSynthesis.cancel();
    } catch (e) {}

    const thisSessionId = _currentAudioSessionId;

    // Minimal 25ms dispatch for instant, zero-lag response
    _ttsSpeakTimer = setTimeout(() => {
        _ttsSpeakTimer = null;
        if (thisSessionId !== _currentAudioSessionId) return;

        const spokenText = _cleanTextForSpeech(text);
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.lang = lang || 'en-IN';
        utterance.rate = 1.06;   // Natural, brisk conversational cadence
        utterance.pitch = 0.92;  // Deep, warm vocal resonance
        utterance.volume = 1.0;  // Full clarity

        const voices = window.speechSynthesis.getVoices();
        const maleVoice = _selectBestMaleVoice(voices, lang);
        if (maleVoice) {
            utterance.voice = maleVoice;
            console.log('[TTS] ▶ Smooth Male Voice:', maleVoice.name, '(' + maleVoice.lang + ')');
        }

        if (!window._activeUtterances) window._activeUtterances = [];
        window._activeUtterances.push(utterance);

        let callbackFired = false;
        let keepAliveTimer = null;

        const fireCallback = () => {
            if (callbackFired) return;
            callbackFired = true;
            if (window._activeUtterances) {
                window._activeUtterances = window._activeUtterances.filter(u => u !== utterance);
            }
            if (_ttsWatchdog)   { clearTimeout(_ttsWatchdog);   _ttsWatchdog = null; }
            if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
            if (onEndCallback && thisSessionId === _currentAudioSessionId) onEndCallback();
        };

        utterance.onend = fireCallback;
        utterance.onerror = (e) => {
            if (e.error === 'interrupted') return;
            console.warn('[TTS] Speech error:', e.error);
            fireCallback();
        };

        // Watchdog based on word count (~145 words/min)
        const wordCount = spokenText.split(/\s+/).length;
        const estimatedMs = Math.max(3000, (wordCount / 2.3) * 1000 + 700);
        _ttsWatchdog = setTimeout(fireCallback, estimatedMs);

        try {
            if (window.speechSynthesis.paused) window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);

            keepAliveTimer = setInterval(() => {
                if (thisSessionId !== _currentAudioSessionId) {
                    clearInterval(keepAliveTimer);
                    keepAliveTimer = null;
                    try { window.speechSynthesis.cancel(); } catch(e){}
                    return;
                }
                if (!window.speechSynthesis.speaking) {
                    clearInterval(keepAliveTimer);
                    keepAliveTimer = null;
                } else {
                    window.speechSynthesis.pause();
                    window.speechSynthesis.resume();
                }
            }, 8000);
        } catch (err) {
            console.warn('[TTS] speak exception:', err);
            fireCallback();
        }
    }, 25);
}

let _currentAudioSessionId = 0;
let _activeAudioElement = null;

function _stopAllAudio() {
    _currentAudioSessionId++;
    if (_activeAudioElement) {
        try {
            _activeAudioElement.onended = null;
            _activeAudioElement.onerror = null;
            _activeAudioElement.oncanplay = null;
            _activeAudioElement.pause();
            _activeAudioElement.src = '';
        } catch (e) {}
        _activeAudioElement = null;
    }
    if (_ttsSpeakTimer) { clearTimeout(_ttsSpeakTimer); _ttsSpeakTimer = null; }
    if (_ttsWatchdog)   { clearTimeout(_ttsWatchdog);   _ttsWatchdog = null; }
    if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    if (window._activeUtterances) {
        window._activeUtterances = [];
    }
}

/**
 * Pure JavaScript Native Neural Voice Engine.
 * Streams accurate native speech for Telugu (te), Tamil (ta), Hindi (hi), Kannada (kn), and English.
 * Instant zero-lag playback with 100% accurate native pronunciation.
 */
function _playNativeNeuralAudio(text, lang, onEndCallback) {
    _stopAllAudio();
    const thisSessionId = _currentAudioSessionId;
    const cleanText = _cleanTextForSpeech(text);
    if (!cleanText) { if (onEndCallback && thisSessionId === _currentAudioSessionId) onEndCallback(); return; }

    const langCode = (lang || 'en-IN').toLowerCase();
    const tl = langCode.startsWith('te') ? 'te'
             : langCode.startsWith('ta') ? 'ta'
             : langCode.startsWith('hi') ? 'hi'
             : langCode.startsWith('kn') ? 'kn'
             : 'en-IN';

    // Split text into chunks <= 130 chars for natural cadence & instant streaming
    const chunks = [];
    const sentences = cleanText.split(/(?<=[.!?।॥,])\s+/);
    let current = '';

    for (const s of sentences) {
        if ((current + ' ' + s).trim().length > 130 && current.length > 0) {
            chunks.push(current.trim());
            current = '';
        }
        current += (current ? ' ' : '') + s;
    }
    if (current.trim().length > 0) {
        if (current.length > 130) {
            const words = current.split(/\s+/);
            let wChunk = '';
            for (const w of words) {
                if ((wChunk + ' ' + w).length > 130 && wChunk.length > 0) {
                    chunks.push(wChunk.trim());
                    wChunk = '';
                }
                wChunk += (wChunk ? ' ' : '') + w;
            }
            if (wChunk.trim().length > 0) chunks.push(wChunk.trim());
        } else {
            chunks.push(current.trim());
        }
    }

    if (chunks.length === 0) { if (onEndCallback && thisSessionId === _currentAudioSessionId) onEndCallback(); return; }

    let chunkIndex = 0;
    const playNextChunk = () => {
        if (thisSessionId !== _currentAudioSessionId) return;
        if (chunkIndex >= chunks.length) {
            _activeAudioElement = null;
            if (onEndCallback && thisSessionId === _currentAudioSessionId) onEndCallback();
            return;
        }

        const chunk = chunks[chunkIndex++];
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
        const audio = new Audio(url);
        audio.playbackRate = 1.08;
        _activeAudioElement = audio;

        audio.onended = () => {
            if (thisSessionId !== _currentAudioSessionId) return;
            playNextChunk();
        };

        audio.onerror = (err) => {
            if (thisSessionId !== _currentAudioSessionId) return;
            console.warn('[TTS] Neural audio failed for chunk, falling back:', err);
            _browserSpeak(cleanText, lang, onEndCallback);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (thisSessionId !== _currentAudioSessionId) {
                    try { audio.pause(); audio.src = ''; } catch(e){}
                    return;
                }
                console.log('[TTS] ▶ Playing authentic native voice (' + tl + ')');
            }).catch(err => {
                if (thisSessionId !== _currentAudioSessionId) return;
                console.warn('[TTS] Audio autoplay blocked, using browser fallback:', err);
                _browserSpeak(cleanText, lang, onEndCallback);
            });
        }
    };

    playNextChunk();
}

/**
 * speakText — Primary voice synthesis function.
 * Fetches native studio audio from /api/tts and plays seamlessly via HTML5 audio.
 * Zero lag, 100% accurate native pronunciation for Telugu, Tamil, Hindi, Kannada, and English.
 */
function speakText(text, lang = 'en-IN', onEndCallback) {
    if (!chatVoiceEnabled) { if (onEndCallback) onEndCallback(); return; }
    if (!text || !text.trim()) { if (onEndCallback) onEndCallback(); return; }

    const clean = _cleanTextForSpeech(text);
    const l = lang || 'en-IN';

    _stopAllAudio();
    const thisSessionId = _currentAudioSessionId;

    // Call local Java /api/tts endpoint
    fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, lang: l })
    })
    .then(r => r.json())
    .then(data => {
        if (thisSessionId !== _currentAudioSessionId) return;
        const tts = data.tts || data;
        if (tts && tts.audio && tts.audio.length > 50) {
            const audio = new Audio('data:audio/mp3;base64,' + tts.audio);
            audio.playbackRate = 1.08;
            _activeAudioElement = audio;

            let callbackFired = false;
            const fireCallback = () => {
                if (callbackFired) return;
                callbackFired = true;
                _activeAudioElement = null;
                if (onEndCallback && thisSessionId === _currentAudioSessionId) onEndCallback();
            };

            audio.onended = fireCallback;
            audio.onerror = () => {
                if (thisSessionId !== _currentAudioSessionId) return;
                _browserSpeak(clean, l, onEndCallback);
            };

            const p = audio.play();
            if (p !== undefined) {
                p.then(() => {
                    if (thisSessionId !== _currentAudioSessionId) {
                        try { audio.pause(); audio.src = ''; } catch(e){}
                        return;
                    }
                    console.log('[TTS] ▶ Playing smooth native audio for lang=' + l);
                }).catch(() => {
                    if (thisSessionId !== _currentAudioSessionId) return;
                    _browserSpeak(clean, l, onEndCallback);
                });
            }
        } else {
            if (thisSessionId !== _currentAudioSessionId) return;
            _playNativeNeuralAudio(clean, l, onEndCallback);
        }
    })
    .catch(() => {
        if (thisSessionId !== _currentAudioSessionId) return;
        _playNativeNeuralAudio(clean, l, onEndCallback);
    });
}

// Warm up voices
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}

// =============================================================================
// APPLICATION INITIALIZATION & NAVIGATION
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadDashboard();
    loadBeneficiaries();
    loadCatalogs();
    setAppLanguage(currentAppLang);

    const initTime = document.getElementById('chat-init-time');
    if (initTime) initTime.textContent = formatChatTime();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));

    const btn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    const pane = document.getElementById(`tab-${tabId}`);

    if (btn && pane) {
        btn.classList.add('active');
        pane.classList.add('active');
    }

    if (tabId === 'dashboard') loadDashboard();
    if (tabId === 'profiler') {
        loadBeneficiaries();
        const firstInput = document.getElementById('reg-name');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
}

function changeGlobalLanguage(lang) {
    currentAppLang = lang;
    currentAppLanguage = lang;
    const sel = document.getElementById('global-lang-select');
    if (sel && sel.value !== lang) sel.value = lang;
    setAppLanguage(lang);
}

function setAppLanguage(lang) {
    currentAppLang = lang || 'en-IN';
    currentAppLanguage = currentAppLang;
    const dict = I18N[currentAppLang] || I18N['en-IN'];

    const gSel = document.getElementById('global-lang-select');
    if (gSel && gSel.value !== currentAppLang) gSel.value = currentAppLang;

    // 1. Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    // 2. Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.placeholder = dict[key];
    });

    // 3. Titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key]) el.title = dict[key];
    });

    // Update registration form default lang
    const regLang = document.getElementById('reg-lang');
    if (regLang) {
        const langMap = { 'te-IN': 'Telugu', 'ta-IN': 'Tamil', 'hi-IN': 'Hindi', 'kn-IN': 'Kannada', 'en-IN': 'English' };
        if (langMap[currentAppLang]) regLang.value = langMap[currentAppLang];
    }

    // Refresh dynamic lists and tables
    if (allBeneficiaries && allBeneficiaries.length > 0) {
        renderDashboardTable(allBeneficiaries);
        renderProfileList(allBeneficiaries);
    }

    // Refresh catalog table with localized database items
    filterCatalog();

    // Auto-refresh recommendations and roadmap in newly selected language if loaded
    const trainingContainer = document.getElementById('training-results');
    if (trainingContainer && !trainingContainer.querySelector('.empty-state')) {
        runTrainingRecommendations();
    }
    const jobContainer = document.getElementById('job-results');
    if (jobContainer && !jobContainer.querySelector('.empty-state')) {
        runJobRecommendations();
    }
    const roadmapContainer = document.getElementById('roadmap-results');
    if (roadmapContainer && !roadmapContainer.querySelector('.empty-state')) {
        loadPersonalRoadmap();
    }
}

function getLocalizedStatus(status) {
    const dict = I18N[currentAppLang] || I18N['en-IN'];
    switch (status) {
        case 'Profile Created': return dict.st_created || status;
        case 'Recommendation Generated': return dict.st_rec_gen || status;
        case 'Enrolled': return dict.st_enrolled || status;
        case 'Training In Progress': return dict.st_training_prog || status;
        case 'Training Completed': return dict.st_training_comp || status;
        case 'Placed': return dict.st_placed || status;
        case 'Self-Employment Started': return dict.st_self_emp || status;
        case 'Needs Officer Support': return dict.st_hitl || status;
        default: return status;
    }
}

// =============================================================================
// 1. DASHBOARD LOGIC
// =============================================================================
async function loadDashboard() {
    try {
        const res = await fetch('/api/dashboard');
        const metrics = await res.json();

        document.getElementById('m-total').innerText = metrics.total;
        document.getElementById('m-enrolled').innerText = metrics.enrolled + metrics.inProgress;
        document.getElementById('m-placed').innerText = metrics.placed + metrics.selfEmployed;
        document.getElementById('m-support').innerText = metrics.needsSupport;

        const banner = document.getElementById('hitl-banner');
        if (metrics.needsSupport > 0) {
            banner.classList.remove('hidden');
        } else {
            banner.classList.add('hidden');
        }

        const bRes = await fetch('/api/beneficiaries');
        allBeneficiaries = await bRes.json();
        renderDashboardTable(allBeneficiaries);
        populateDropdowns(allBeneficiaries);

    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

function renderDashboardTable(list) {
    const tbody = document.getElementById('dashboard-table-body');
    tbody.innerHTML = '';
    const dict = I18N[currentAppLang] || I18N['en-IN'];

    if (!list || list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">${dict.no_beneficiaries || 'No beneficiaries found in database.'}</td></tr>`;
        return;
    }

    list.forEach(b => {
        const tr = document.createElement('tr');
        const badgeClass = getStatusBadgeClass(b.status);
        const localizedStatus = getLocalizedStatus(b.status);

        tr.innerHTML = `
            <td><strong>${b.id}</strong></td>
            <td>${escapeHtml(b.name)}</td>
            <td>${escapeHtml(b.phone)}</td>
            <td>${escapeHtml(b.region)}</td>
            <td><span class="badge ${badgeClass}">${escapeHtml(localizedStatus)}</span></td>
            <td>${b.registrationDate}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="openProfileModal('${b.id}')">${dict.btn_profile || '👁️ Profile'}</button>
                <button class="btn btn-secondary btn-sm" onclick="openStatusModal('${b.id}')">${dict.btn_status || '✏️ Status'}</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterDashboardLive() {
    const q = document.getElementById('dash-search').value.toLowerCase();
    const filtered = allBeneficiaries.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.id.toLowerCase().includes(q) || 
        b.region.toLowerCase().includes(q) ||
        b.phone.includes(q)
    );
    renderDashboardTable(filtered);
}

function filterDashboardTable(status) {
    const filtered = allBeneficiaries.filter(b => b.status === status);
    renderDashboardTable(filtered);
}

// =============================================================================
// 2. INTERACTIVE TURN-TAKING AI VOICE CALL AGENT (Option 1)
// =============================================================================
const CallAgent = {
    sessionId: null,
    language: 'en-IN',
    step: 1,
    state: 'IDLE',
    timerInterval: null,
    seconds: 0,
    recognition: null,
    lastPrompt: '',

    reset() {
        _stopAllAudio();
        this.sessionId = null;
        this.step = 1;
        this.state = 'IDLE';
        this.seconds = 0;
        this.lastPrompt = '';
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.recognition) {
            try { this.recognition.abort(); } catch(e){}
            this.recognition = null;
        }
        if (window.speechSynthesis) {
            try { window.speechSynthesis.cancel(); } catch(e){}
        }
    }
};

// =============================================================================
// VOICE CALL AGENT — Phase 1: Language Selection → Phase 2: Full Onboarding
// All speech via Puter.js TTS (free, no API key). Listening via browser SpeechRecognition.
// =============================================================================

async function startInteractiveVoiceCall(preLang) {
    CallAgent.reset();

    const modal = document.getElementById('voice-call-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset timer
    document.getElementById('call-timer').textContent = '00:00';
    CallAgent.timerInterval = setInterval(() => {
        CallAgent.seconds++;
        const m = String(Math.floor(CallAgent.seconds / 60)).padStart(2, '0');
        const s = String(CallAgent.seconds % 60).padStart(2, '0');
        document.getElementById('call-timer').textContent = `${m}:${s}`;
    }, 1000);

    if (preLang) {
        // Language already known — skip selection phase
        await selectCallLanguage(preLang);
        return;
    }

    // ── Phase 1: Language Selection ──────────────────────────────────────────
    CallAgent.state = 'LANG_SELECT';
    _showCallScreen('lang');
    setCallBanner('Language Selection', 'Please choose your preferred language', '🌐', '');

    // Concise, clear welcome prompt
    const langPrompt = 'Namaste! Welcome to Saathi. Please choose your preferred language.';

    speakText(langPrompt, 'en-IN', () => {
        // After speaking, start listening for spoken language name
        if (CallAgent.state === 'LANG_SELECT') {
            _listenForLanguage();
        }
    });
}

/** Listen for a spoken language name and auto-detect it */
function _listenForLanguage() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const listenBar = document.getElementById('call-lang-listen-bar');
    if (listenBar) listenBar.style.display = 'block';

    if (!SR || CallAgent.state !== 'LANG_SELECT') return;

    const recognition = new SR();
    recognition.lang = 'en-IN';   // broad recognition to catch all language names
    recognition.interimResults = false;
    recognition.continuous = false;
    CallAgent.recognition = recognition;

    recognition.onresult = (e) => {
        const spoken = e.results[0][0].transcript.toLowerCase().trim();
        console.log('[CallAgent] Language spoken:', spoken);
        const detected = _detectLangFromText(spoken);
        if (detected) {
            selectCallLanguage(detected);
        }
        // If not detected, user can still click a button
    };

    recognition.onerror = () => { /* silent — buttons still work */ };
    recognition.onend = () => {
        if (listenBar) listenBar.style.display = 'none';
    };

    try { recognition.start(); } catch(e) {}
}

/** Detect BCP-47 language code from a spoken keyword */
function _detectLangFromText(text) {
    if (/telugu|telgu|te\b|తెలుగు/.test(text))   return 'te-IN';
    if (/tamil|tamizh|ta\b|தமிழ்/.test(text))     return 'ta-IN';
    if (/hindi|hind|hi\b|हिंदी|हिन्दी/.test(text)) return 'hi-IN';
    if (/kannada|kannad|kn\b|ಕನ್ನಡ/.test(text))   return 'kn-IN';
    if (/english|eng\b/.test(text))                return 'en-IN';
    return null;
}

/** Switch the call modal from lang-select to Q&A screens */
function _showCallScreen(screen) {
    const langScreen = document.getElementById('call-lang-select-screen');
    const transcript = document.getElementById('call-transcript-stream');
    if (screen === 'lang') {
        if (langScreen) langScreen.style.display = 'block';
        if (transcript) transcript.style.display = 'none';
    } else {
        if (langScreen) langScreen.style.display = 'none';
        if (transcript) { transcript.style.display = 'flex'; transcript.innerHTML = ''; }
    }
}

/** Called when user clicks or speaks a language — Phase 2 starts */
async function selectCallLanguage(lang) {
    if (CallAgent.state === 'COMPLETED') return;

    // Immediately cancel all existing greeting/prompt audio and recognition
    _stopAllAudio();
    if (CallAgent.recognition) {
        try { CallAgent.recognition.abort(); } catch(e) {}
        CallAgent.recognition = null;
    }

    CallAgent.language = lang;
    CallAgent.state = 'STARTING';

    const badgeMap = {
        'te-IN': '🇮🇳 Telugu (తెలుగు)',
        'ta-IN': '🇮🇳 Tamil (தமிழ்)',
        'hi-IN': '🇮🇳 Hindi (हिंदी)',
        'kn-IN': '🇮🇳 Kannada (ಕನ್ನಡ)',
        'en-IN': '🇬🇧 English'
    };
    document.getElementById('call-lang-badge').textContent = badgeMap[lang] || lang;

    // Highlight the selected language button briefly
    document.querySelectorAll('.call-lang-btn').forEach(b => b.style.opacity = '0.5');
    const selectedId = { 'te-IN':'clb-te','ta-IN':'clb-ta','hi-IN':'clb-hi','kn-IN':'clb-kn','en-IN':'clb-en' }[lang];
    const selBtn = document.getElementById(selectedId);
    if (selBtn) { selBtn.style.opacity = '1'; selBtn.style.transform = 'scale(1.05)'; }

    // Transition to Q&A screen after a short delay
    await new Promise(r => setTimeout(r, 300));
    _showCallScreen('qa');
    setCallBanner('Connecting...', 'Starting onboarding session', '🔄', '');

    // Confirmation message in the chosen language
    const confirmMsg = {
        'te-IN': 'తెలుగు ఎంపిక చేసారు. Saathi AI కాల్ ప్రారంభమవుతోంది!',
        'ta-IN': 'தமிழ் தேர்ந்தெடுக்கப்பட்டது. Saathi AI அழைப்பு தொடங்குகிறது!',
        'hi-IN': 'हिंदी चुनी गई। Saathi AI कॉल शुरू हो रही है!',
        'kn-IN': 'ಕನ್ನಡ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ. Saathi AI ಕರೆ ಪ್ರಾರಂಭವಾಗುತ್ತಿದೆ!',
        'en-IN': 'English selected. Starting Saathi AI call!'
    }[lang] || 'Starting call...';

    appendCallTranscript('ai', '📞 ' + confirmMsg);

    // Start the server-side onboarding session
    try {
        const res = await fetch('/api/onboarding/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'call', language: lang })
        });
        const data = await res.json();
        if (data.error) {
            appendCallTranscript('ai', '❌ ' + data.error);
            return;
        }
        CallAgent.sessionId = data.sessionId;
        CallAgent.step = 1;

        // Directly execute step 1 prompt without duplicate confirm message playback
        executeCallAiTurn(data.prompt, data.tts);

    } catch(err) {
        appendCallTranscript('ai', '⚠️ Could not connect to Saathi server. Please try again.');
        setCallBanner('Connection Error', 'Check your server', '❌', 'state-retry');
    }
}

function executeCallAiTurn(promptText, ttsData) {
    CallAgent.state = 'AI_SPEAKING';
    CallAgent.lastPrompt = promptText;

    setCallBanner('AI Speaking...', 'Please listen to the question', '🤖', 'state-speaking');
    const wave = document.getElementById('call-wave-container');
    if (wave) wave.className = 'call-wave-container wave-speaking';

    appendCallTranscript('ai', promptText);

    const onSpoken = () => {
        if (CallAgent.state === 'AI_SPEAKING') {
            startCallUserListeningTurn();
        }
    };

    // Always use Puter.js TTS (free, no API key) — ignore any backend TTS audio
    speakText(promptText, CallAgent.language, onSpoken);
}

function startCallUserListeningTurn() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
        setCallBanner('Mic Unavailable', 'Please use the "Type" button below to answer', '⌨️', 'state-retry');
        toggleCallFallback(true);
        return;
    }

    CallAgent.state = 'LISTENING';
    setCallBanner('Listening...', 'Please speak your response clearly now', '🎤', 'state-listening');
    const wave = document.getElementById('call-wave-container');
    if (wave) wave.className = 'call-wave-container wave-listening';

    const recognition = new SR();
    recognition.lang = CallAgent.language;
    recognition.interimResults = false;
    recognition.continuous = false;
    CallAgent.recognition = recognition;

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript.trim();
        if (transcript) {
            appendCallTranscript('user', transcript);
            await submitCallAnswer(transcript);
        }
    };

    recognition.onerror = () => {
        if (CallAgent.state === 'LISTENING') {
            setCallBanner('Waiting for voice...', 'Click Replay 🔊 or Type ⌨️ if needed', '👂', 'state-speaking');
        }
    };

    recognition.onend = () => {
        if (CallAgent.state === 'LISTENING') {
            setTimeout(() => {
                if (CallAgent.state === 'LISTENING') {
                    try { recognition.start(); } catch(e) {}
                }
            }, 600);
        }
    };

    try { recognition.start(); } catch(e) { console.warn('STT error:', e); }
}

async function submitCallAnswer(answerText) {
    CallAgent.state = 'PROCESSING';
    setCallBanner('Processing...', 'Validating response...', '⚙️', 'state-processing');
    const wave = document.getElementById('call-wave-container');
    if (wave) wave.className = 'call-wave-container';

    try {
        const res = await fetch('/api/onboarding/transcribe-and-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: CallAgent.sessionId, text: answerText })
        });
        const data = await res.json();

        if (data.error) {
            appendCallTranscript('ai', '⚠️ ' + data.error);
            executeCallAiTurn(data.error);
            return;
        }

        if (!data.valid) {
            CallAgent.state = 'RETRY';
            setCallBanner('Invalid Response', 'Please clarify your response', '⚠️', 'state-retry');
            executeCallAiTurn(data.nextPrompt, data.tts);
            return;
        }

        if (data.done) {
            CallAgent.state = 'COMPLETED';
            const doneMsg = {
                'te-IN': '🎉 అన్ని 10 ప్రశ్నలు పూర్తయ్యాయి! మీ ప్రొఫైల్ సేవ్ అవుతోంది...',
                'ta-IN': '🎉 10 கேள்விகளும் முடிந்தன! உங்கள் சுயவிவரம் சேமிக்கப்படுகிறது...',
                'hi-IN': '🎉 सभी 10 सवाल पूरे हुए! आपकी प्रोफ़ाइल सहेजी जा रही है...',
                'kn-IN': '🎉 10 ಪ್ರಶ್ನೆಗಳು ಮುಗಿದಿವೆ! ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
                'en-IN': '🎉 All 10 questions complete! Saving your profile...'
            }[CallAgent.language] || '🎉 Registration Complete! Finalizing your profile...';
            appendCallTranscript('ai', doneMsg);
            speakText(doneMsg, CallAgent.language);
            await finalizeCallSession();
        } else {
            CallAgent.step = data.step + 1;
            executeCallAiTurn(data.nextPrompt, data.tts);
        }

    } catch(err) {
        setCallBanner('Connection Error', 'Please check server connection', '❌', 'state-retry');
    }
}

async function finalizeCallSession() {
    try {
        const res = await fetch('/api/onboarding/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: CallAgent.sessionId })
        });
        const data = await res.json();
        if (data.success) {
            const congratsMsg = {
                'te-IN': `🎊 మీ ప్రొఫైల్ విజయవంతంగా సేవ్ అయింది! మీ ID: ${data.beneficiaryId}. ధన్యవాదాలు!`,
                'ta-IN': `🎊 உங்கள் சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது! உங்கள் ID: ${data.beneficiaryId}. நன்றி!`,
                'hi-IN': `🎊 आपकी प्रोफ़ाइल सफलतापूर्वक सहेजी गई! आपकी ID: ${data.beneficiaryId}. धन्यवाद!`,
                'kn-IN': `🎊 ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ID: ${data.beneficiaryId}. ಧನ್ಯವಾದಗಳು!`,
                'en-IN': `🎊 Your profile has been saved successfully! Assigned ID: ${data.beneficiaryId}. Thank you!`
            }[CallAgent.language] || `🎊 Profile saved! ID: ${data.beneficiaryId}`;

            appendCallTranscript('ai', congratsMsg);
            speakText(congratsMsg, CallAgent.language);
            setCallBanner('✅ Registration Complete!', 'Profile saved to database', '🎊', 'state-speaking');

            // Reload dashboard data then show the profile
            loadDashboard();
            loadBeneficiaries();

            setTimeout(() => {
                confirmEndCall();
                openProfileModal(data.beneficiaryId);
            }, 3500);
        }
    } catch(err) {
        appendCallTranscript('ai', '⚠️ Error saving profile. Please try again.');
    }
}



function setCallBanner(title, desc, icon, stateClass) {
    const banner = document.getElementById('call-state-banner');
    if (banner) banner.className = `call-state-banner ${stateClass || ''}`;
    document.getElementById('call-state-title').textContent = title;
    document.getElementById('call-state-desc').textContent = desc;
    document.getElementById('call-state-icon').textContent = icon;
}

function appendCallTranscript(role, text) {
    const stream = document.getElementById('call-transcript-stream');
    if (!stream) return;
    const div = document.createElement('div');
    div.className = `call-bubble bubble-${role}`;
    div.innerHTML = `<p>${escapeHtml(text)}</p><span class="bubble-time">${formatChatTime()}</span>`;
    stream.appendChild(div);
    stream.scrollTop = stream.scrollHeight;
}

function confirmEndCall() {
    CallAgent.reset();
    const modal = document.getElementById('voice-call-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function replayCallPrompt() {
    if (CallAgent.lastPrompt) {
        executeCallAiTurn(CallAgent.lastPrompt);
    }
}

function toggleCallFallback(force) {
    const drawer = document.getElementById('call-fallback-drawer');
    if (force !== undefined) {
        drawer.classList.toggle('active', force);
    } else {
        drawer.classList.toggle('active');
    }
    if (drawer.classList.contains('active')) {
        document.getElementById('call-fallback-input')?.focus();
    }
}

function submitCallFallback() {
    const input = document.getElementById('call-fallback-input');
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    toggleCallFallback(false);
    appendCallTranscript('user', val);
    submitCallAnswer(val);
}

// =============================================================================
// 3. PUSH-TO-TALK & ONBOARDING MODAL CONTROLLER (Option 2 & Option 3)
// =============================================================================
const LOCALIZED_OB_PROMPTS = {
    'en-IN': [
        "Welcome to Saathi! I will guide you through 10 quick questions to set up your livelihood profile. Let's begin. Step 1: Please tell me your full name.",
        "Step 1: Please tell me your full name.",
        "Step 2: What is your 10-digit mobile phone number?",
        "Step 3: What is your highest education level? (For example: 10th Pass, 12th Pass, Graduate, ITI, or None)",
        "Step 4: What is your family or traditional occupation? (For example: Agriculture, Weaving, Leatherwork, Artisan)",
        "Step 5: What is your current livelihood or work? (For example: Unemployed, Daily Wage Worker, Tailor)",
        "Step 6: What are your existing skills or hobbies? (For example: Sewing, Basic Computer, Driving, Cooking)",
        "Step 7: What are your future career aspirations or interests?",
        "Step 8: Do you have any mobility or working constraints? (For example: Local area only, Day shifts only, None)",
        "Step 9: What type of employment do you prefer? Wage Employment, Self-Employment, or Both?",
        "Step 10: What is your region or district? (For example: Rural – Salem, Urban – Delhi)"
    ],
    'hi-IN': [
        "साथी में आपका स्वागत है! मैं 10 सवालों के माध्यम से आपकी आजीविका प्रोफ़ाइल बनाऊँगा। चलिए शुरू करते हैं। चरण 1: कृपया अपना पूरा नाम बताएं।",
        "चरण 1: कृपया अपना पूरा नाम बताएं।",
        "चरण 2: आपका 10 अंकों का मोबाइल नंबर क्या है?",
        "चरण 3: आपकी उच्चतम शिक्षा क्या है? (उदाहरण: 10वीं पास, 12वीं, ग्रेजुएट, आईटीआई, कोई नहीं)",
        "चरण 4: आपके परिवार का पारंपरिक व्यवसाय क्या है? (उदाहरण: कृषि, बुनाई, चमड़ा कार्य, कारीगरी)",
        "चरण 5: आप अभी क्या काम करते हैं? (उदाहरण: बेरोजगार, दैनिक मजदूर, दर्जी)",
        "चरण 6: आपके पास कौन से कौशल या शौक हैं? (उदाहरण: सिलाई, कंप्यूटर, ड्राइविंग)",
        "चरण 7: भविष्य में आप क्या करना चाहते हैं?",
        "चरण 8: क्या आपकी कोई आवागमन या काम की बाधा है? (उदाहरण: केवल स्थानीय, दिन की पाली, कोई नहीं)",
        "चरण 9: आप किस प्रकार का रोजगार चाहते हैं? वेतन रोजगार, स्वरोजगार, या दोनों?",
        "चरण 10: आपका जिला या क्षेत्र कौन सा है? (उदाहरण: ग्रामीण – वाराणसी, शहरी – दिल्ली)"
    ],
    'ta-IN': [
        "சாதிக்கு வருக! 10 கேள்விகள் மூலம் உங்கள் வாழ்வாதார சுயவிவரத்தை உருவாக்குகிறேன். தொடங்கலாம். படி 1: உங்கள் முழு பெயரை சொல்லுங்கள்.",
        "படி 1: உங்கள் முழு பெயரை சொல்லுங்கள்.",
        "படி 2: உங்கள் 10 இலக்க மொபைல் எண் என்ன?",
        "படி 3: உங்கள் கல்வித் தகுதி என்ன? (உதாரணம்: 10ஆம் வகுப்பு, 12ஆம் வகுப்பு, பட்டதாரி, ITI, இல்லை)",
        "படி 4: உங்கள் குடும்பத்தின் பாரம்பரிய தொழில் என்ன? (உதாரணம்: விவசாயம், நெசவு, தோல் வேலை)",
        "படி 5: தற்போது நீங்கள் என்ன வேலை செய்கிறீர்கள்? (உதாரணம்: வேலையற்றவர், கூலி வேலை, தையற்காரர்)",
        "படி 6: உங்களுக்கு என்ன திறமைகள் அல்லது பொழுதுபோக்குகள் உள்ளன?",
        "படி 7: எதிர்காலத்தில் நீங்கள் என்ன செய்ய விரும்புகிறீர்கள்?",
        "படி 8: உங்களுக்கு ஏதேனும் பயண அல்லது வேலை கட்டுப்பாடுகள் உள்ளதா?",
        "படி 9: நீங்கள் எந்த வகையான வேலையை விரும்புகிறீர்கள்? ஊதிய வேலை, சுய வேலை, அல்லது இரண்டும்?",
        "படி 10: உங்கள் மாவட்டம் அல்லது பகுதி எது? (உதாரணம்: கிராமம் – சேலம், நகரம் – சென்னை)"
    ],
    'te-IN': [
        "సాధి కి స్వాగతం! 10 ప్రశ్నల ద్వారా మీ జీవనోపాధి ప్రొఫైల్ తయారు చేస్తాను. మొదలుపెట్టండి. దశ 1: దయచేసి మీ పూర్తి పేరు చెప్పండి.",
        "దశ 1: దయచేసి మీ పూర్తి పేరు చెప్పండి.",
        "దశ 2: మీ 10 అంకెల మొబైల్ నంబర్ ఏమిటి?",
        "దశ 3: మీ అత్యధిక విద్యా అర్హత ఏమిటి? (ఉదా: 10వ తరగతి, 12వ తరగతి, గ్రాడ్యుయేట్, ITI, లేదు)",
        "దశ 4: మీ కుటుంబ సాంప్రదాయ వృత్తి ఏమిటి? (ఉదా: వ్యవసాయం, నేత, చర్మ పని)",
        "దశ 5: మీరు ప్రస్తుతం ఏమి చేస్తున్నారు? (ఉదా: నిరుద్యోగి, రోజువారీ కూలీ, టైలర్)",
        "దశ 6: మీకు ఏ నైపుణ్యాలు లేదా హాబీలు ఉన్నాయి?",
        "దశ 7: భవిష్యత్తులో మీరు ఏమి చేయాలనుకుంటున్నారు?",
        "దశ 8: మీకు ఏదైనా పయన లేదా పని పరిమితులు ఉన్నాయా?",
        "దశ 9: మీరు ఏ రకమైన ఉద్యోగాన్ని ఇష్టపడతారు? వేతన ఉద్యోగం, స్వయం ఉపాధి, లేదా రెండూ?",
        "దశ 10: మీ జిల్లా లేదా ప్రాంతం ఏమిటి? (ఉదా: గ్రామీణ – తిరుపతి, పట్టణ – హైదరాబాద్)"
    ],
    'kn-IN': [
        "ಸಾಥಿಗೆ ಸ್ವಾಗತ! 10 ಪ್ರಶ್ನೆಗಳ ಮೂಲಕ ನಿಮ್ಮ ಜೀವನೋಪಾಯ ಪ್ರೊಫೈಲ್ ರಚಿಸುತ್ತೇನೆ. ಪ್ರಾರಂಭಿಸೋಣ. ಹಂತ 1: ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಹೇಳಿ.",
        "ಹಂತ 1: ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಹೇಳಿ.",
        "ಹಂತ 2: ನಿಮ್ಮ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಏನು?",
        "ಹಂತ 3: ನಿಮ್ಮ ಗರಿಷ್ಠ ಶಿಕ್ಷಣ ಮಟ್ಟ ಏನು? (ಉದಾ: 10ನೇ ತರಗತಿ, 12ನೇ ತರಗತಿ, ಪದವಿ, ITI, ಇಲ್ಲ)",
        "ಹಂತ 4: ನಿಮ್ಮ ಕುಟುಂಬದ ಸಾಂಪ್ರದಾಯಿಕ ವೃತ್ತಿ ಏನು? (ಉದಾ: ಕೃಷಿ, ನೇಕಾರಿಕೆ, ಚರ್ಮ ಕೆಲಸ)",
        "ಹಂತ 5: ನೀವು ಪ್ರಸ್ತುತ ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ? (ಉದಾ: ನಿರುದ್ಯೋಗಿ, ದಿನಗೂಲಿ, ದರ್ಜಿ)",
        "ಹಂತ 6: ನಿಮ್ಮ ಬಳಿ ಯಾವ ಕೌಶಲ್ಯ ಅಥವಾ ಹವ್ಯಾಸಗಳಿವೆ?",
        "ಹಂತ 7: ಭವಿಷ್ಯದಲ್ಲಿ ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
        "ಹಂತ 8: ನಿಮಗೆ ಯಾವುದಾದರೂ ಚಲನ ಅಥವಾ ಕೆಲಸದ ನಿರ್ಬಂಧಗಳಿವೆಯೇ?",
        "ಹಂತ 9: ನೀವು ಯಾವ ರೀತಿಯ ಉದ್ಯೋಗ ಬಯಸುತ್ತೀರಿ? ವೇತನ ಉದ್ಯೋಗ, ಸ್ವ-ಉದ್ಯೋಗ, ಅಥವಾ ಎರಡೂ?",
        "ಹಂತ 10: ನಿಮ್ಮ ಜಿಲ್ಲೆ ಅಥವಾ ಪ್ರದೇಶ ಯಾವುದು? (ಉದಾ: ಗ್ರಾಮೀಣ – ಮೈಸೂರು, ನಗರ – ಬೆಂಗಳೂರು)"
    ]
};

const OnboardingController = {
    sessionId: null,
    mode: 'direct',
    language: 'en-IN',
    currentStep: 1,
    lastPrompt: '',
    pttActive: false,
    pttRecognition: null,
    pttTranscript: '',

    reset() {
        this.sessionId = null;
        this.mode = 'direct';
        this.language = currentAppLang || 'en-IN';
        this.currentStep = 1;
        this.lastPrompt = '';
        this.pttTranscript = '';
        if (this.pttRecognition) { try { this.pttRecognition.abort(); } catch(e){} this.pttRecognition = null; }
    }
};

function openOnboardingModal(preMode) {
    OnboardingController.reset();
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
        modal.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
    if (preMode) {
        selectMode(preMode);
    } else {
        showObScreen('mode');
    }
}

function openPttModal() {
    openOnboardingModal('voice');
}

function closeOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
    if (OnboardingController.pttRecognition) {
        try { OnboardingController.pttRecognition.abort(); } catch(e){}
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
}

function restartOnboarding() {
    closeOnboardingModal();
    setTimeout(() => openOnboardingModal(), 200);
}

function showObScreen(name) {
    document.querySelectorAll('.ob-screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(`ob-screen-${name}`);
    if (target) {
        target.classList.remove('hidden');
    }
}

async function selectMode(mode) {
    OnboardingController.mode = mode;
    document.querySelectorAll('.ob-mode-card').forEach(c => c.classList.remove('selected'));
    const card = document.getElementById(`mode-card-${mode}`);
    if (card) card.classList.add('selected');

    const activeLang = OnboardingController.language || currentAppLang || 'en-IN';
    await selectLanguage(activeLang);
}

async function selectLanguage(lang) {
    OnboardingController.language = lang;
    
    // Highlight sidebar language button
    document.querySelectorAll('.ob-qa-lang-btn').forEach(b => b.classList.remove('selected'));
    const shortCode = lang.split('-')[0];
    const btn = document.getElementById(`qa-lang-${shortCode}`);
    if (btn) btn.classList.add('selected');

    showObScreen('qa');
    setupQaMode(OnboardingController.mode || 'direct');

    try {
        const res = await fetch('/api/onboarding/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: OnboardingController.mode || 'direct', language: lang })
        });
        const data = await res.json();
        if (data.error) { alert('Error: ' + data.error); return; }

        OnboardingController.sessionId = data.sessionId;
        OnboardingController.currentStep = 1;
        setObPrompt(data.prompt, lang, 1);
    } catch(err) {
        // Fallback with client prompts
        const prompts = LOCALIZED_OB_PROMPTS[lang] || LOCALIZED_OB_PROMPTS['en-IN'];
        OnboardingController.currentStep = 1;
        setObPrompt(prompts[0], lang, 1);
    }
}

async function switchObLanguage(lang) {
    if (!lang) return;
    OnboardingController.language = lang;

    // Update sidebar UI selection
    document.querySelectorAll('.ob-qa-lang-btn').forEach(btn => btn.classList.remove('selected'));
    const shortCode = lang.split('-')[0];
    const targetBtn = document.getElementById(`qa-lang-${shortCode}`);
    if (targetBtn) targetBtn.classList.add('selected');

    // Update SpeechRecognition language
    if (OnboardingController.pttRecognition) {
        OnboardingController.pttRecognition.lang = lang;
    }

    // Update current prompt text and replay speech
    const currentStep = OnboardingController.currentStep || 1;
    const prompts = LOCALIZED_OB_PROMPTS[lang] || LOCALIZED_OB_PROMPTS['en-IN'];
    const newPrompt = currentStep === 1 ? prompts[0] : (prompts[currentStep] || prompts[1]);
    
    setObPrompt(newPrompt, lang, currentStep);
}

function setupQaMode(mode) {
    const textArea = document.getElementById('ob-answer-text-area');
    const pttArea  = document.getElementById('ob-ptt-area');
    const ivrArea  = document.getElementById('ob-ivr-area');
    const modeLabel = document.getElementById('ob-mode-label');

    if (textArea) textArea.classList.add('hidden');
    if (pttArea) pttArea.classList.add('hidden');
    if (ivrArea) ivrArea.classList.add('hidden');

    if (mode === 'direct') {
        if (textArea) textArea.classList.remove('hidden');
        if (modeLabel) modeLabel.textContent = '📝 Direct';
    } else if (mode === 'voice') {
        if (pttArea) pttArea.classList.remove('hidden');
        if (modeLabel) modeLabel.textContent = '🎤 Voice';
    } else if (mode === 'ivr') {
        if (ivrArea) ivrArea.classList.remove('hidden');
        if (modeLabel) modeLabel.textContent = '📞 IVR';
        ivrClear();
    }
}

function setObPrompt(promptText, lang, step) {
    OnboardingController.lastPrompt = promptText;
    const activeLang = lang || OnboardingController.language || 'en-IN';
    
    // Ensure sidebar button reflects active language
    document.querySelectorAll('.ob-qa-lang-btn').forEach(b => b.classList.remove('selected'));
    const shortCode = activeLang.split('-')[0];
    const targetBtn = document.getElementById(`qa-lang-${shortCode}`);
    if (targetBtn) targetBtn.classList.add('selected');

    const bubble = document.getElementById('ob-prompt-text');
    if (bubble) {
        bubble.textContent = promptText;
        bubble.classList.remove('prompt-animate');
        void bubble.offsetWidth;
        bubble.classList.add('prompt-animate');
    }
    const label = document.getElementById('ob-step-label');
    const fill  = document.getElementById('ob-progress-fill');
    if (label) label.textContent = `Step ${step} of 10`;
    if (fill) fill.style.width = `${Math.min(step * 10, 100)}%`;

    const errEl = document.getElementById('ob-error');
    if (errEl) errEl.textContent = '';

    speakText(promptText, activeLang);

    const input = document.getElementById('ob-answer-input');
    if (input) { input.value = ''; input.focus(); }
    const pttT = document.getElementById('ob-ptt-transcript');
    if (pttT) { pttT.value = ''; pttT.textContent = ''; }
    OnboardingController.pttTranscript = '';
    const pttNext = document.getElementById('ob-ptt-next-btn');
    if (pttNext) pttNext.disabled = true;
    ivrClear();
}

async function submitObStep() {
    const mode = OnboardingController.mode;
    let answer = '';

    if (mode === 'direct') {
        answer = (document.getElementById('ob-answer-input')?.value || '').trim();
    } else if (mode === 'voice') {
        const transcriptEl = document.getElementById('ob-ptt-transcript');
        answer = (transcriptEl?.value || transcriptEl?.textContent || OnboardingController.pttTranscript || '').trim();
    } else if (mode === 'ivr') {
        answer = (document.getElementById('ob-ivr-input')?.textContent || '').trim();
    }

    if (!answer) {
        const errEl = document.getElementById('ob-error');
        if (errEl) errEl.textContent = '⚠️ Please provide an answer before continuing.';
        return;
    }

    ['ob-next-btn','ob-ptt-next-btn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.disabled = true; el.textContent = '⏳...'; }
    });

    try {
        const res = await fetch('/api/onboarding/transcribe-and-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: OnboardingController.sessionId, text: answer })
        });
        const data = await res.json();

        if (data.error) {
            const errEl = document.getElementById('ob-error');
            if (errEl) errEl.textContent = '❌ ' + data.error;
            return;
        }

        if (!data.valid) {
            const errEl = document.getElementById('ob-error');
            if (errEl) errEl.textContent = '⚠️ Invalid answer. Please try again.';
            setObPrompt(data.nextPrompt, OnboardingController.language, data.step);
            return;
        }

        if (data.done) {
            setObPrompt(data.nextPrompt, OnboardingController.language, 10);
            setTimeout(() => completeOnboardingSession(), 1800);
        } else {
            OnboardingController.currentStep = data.step + 1;
            setObPrompt(data.nextPrompt, OnboardingController.language, data.step + 1);
        }
    } catch(err) {
        const errEl = document.getElementById('ob-error');
        if (errEl) errEl.textContent = '❌ Connection error.';
    } finally {
        ['ob-next-btn','ob-ptt-next-btn'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.disabled = false; el.textContent = el.id === 'ob-ptt-next-btn' ? (getTranslation('btn_submit_ans') || 'Submit →') : (getTranslation('btn_next') || 'Next →'); }
        });
    }
}

async function completeOnboardingSession() {
    try {
        const res = await fetch('/api/onboarding/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: OnboardingController.sessionId })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('ob-success-id').textContent = data.beneficiaryId;
            document.getElementById('ob-success-status').textContent = data.status;
            showObScreen('success');
            speakText('Registration complete! Your profile has been saved.', OnboardingController.language);
        }
    } catch(err) {
        alert('Connection error during completion.');
    }
}

function replayTts() {
    speakText(OnboardingController.lastPrompt, OnboardingController.language);
}

function startObVoiceInput() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = OnboardingController.language;
    recognition.interimResults = false;
    const micBtn = document.getElementById('ob-mic-btn');
    if (micBtn) { micBtn.textContent = '🔴'; micBtn.disabled = true; }

    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        const input = document.getElementById('ob-answer-input');
        if (input) input.value = transcript;
    };
    recognition.onend = () => { if (micBtn) { micBtn.textContent = '🎤'; micBtn.disabled = false; } };
    recognition.onerror = () => { if (micBtn) { micBtn.textContent = '🎤'; micBtn.disabled = false; } };
    recognition.start();
}

let pttPressStartTime = 0;
let pttHoldTimer = null;

function handlePttMouseDown() {
    pttPressStartTime = Date.now();
    pttHoldTimer = setTimeout(() => {
        if (!OnboardingController.pttActive) {
            startPtt();
        }
    }, 250);
}

function handlePttMouseUp() {
    const pressDuration = Date.now() - pttPressStartTime;
    if (pttHoldTimer) clearTimeout(pttHoldTimer);
    
    // If it was a long press (> 300ms) and recognition is active, stop it upon release
    if (pressDuration > 300 && OnboardingController.pttActive) {
        stopPtt();
    }
}

function handlePttClick() {
    // If it was a short tap (< 300ms), toggle recording state
    const pressDuration = Date.now() - pttPressStartTime;
    if (pressDuration <= 300) {
        if (OnboardingController.pttActive) {
            stopPtt();
        } else {
            startPtt();
        }
    }
}

function handlePttTouchStart(e) {
    handlePttMouseDown();
}

function handlePttTouchEnd(e) {
    handlePttMouseUp();
}

function handlePttTranscriptInput(val) {
    OnboardingController.pttTranscript = (val || '').trim();
    const pttNext = document.getElementById('ob-ptt-next-btn');
    if (pttNext) {
        pttNext.disabled = !OnboardingController.pttTranscript;
    }
}

const STEP_SAMPLE_ANSWERS = {
    'en-IN': ['Ramesh Kumar', '9876543210', '10th Pass', 'Handloom Weaving', 'Daily Wage Worker', 'Basic Sewing, Handloom Operation', 'Start Local Tailoring Shop', 'Local District Only', 'Self Employment', 'Rural Salem'],
    'te-IN': ['రమేష్ కుమార్', '9876543210', '10వ తరగతి', 'చేనేత నేత', 'రోజువారీ కూలీ', 'కుట్టు పని, మెషిన్ కుట్టు', 'స్వంత కుట్టు కేంద్రం ప్రారంభించడం', 'స్థానిక జిల్లా మాత్రమే', 'స్వయం ఉపాధి', 'గ్రామీణ సేలం'],
    'ta-IN': ['ரமேஷ் குமார்', '9876543210', '10ஆம் வகுப்பு', 'கைத்தறி நெசவு', 'கூலி வேலை', 'தையல், இயந்திர தையல்', 'சொந்த தையல் அகம் தொடங்குதல்', 'உள்ளூர் மாவட்டம் மட்டும்', 'சுய வேலை', 'கிராமம் சேலம்'],
    'hi-IN': ['रमेश कुमार', '9876543210', '10वीं पास', 'हथकरघा बुनाई', 'दैनिक मजदूर', 'सिलाई, मशीन सिलाई', 'खुद की सिलाई दुकान शुरू करना', 'केवल स्थानीय जिला', 'स्वरोजगार', 'ग्रामीण सलेम'],
    'kn-IN': ['ರಮೇಶ್ ಕುಮಾರ್', '9876543210', '10ನೇ ತರಗತಿ', 'ಕೈಮಗ್ಗ ನೇಕಾರಿಕೆ', 'ದಿನಗೂಲಿ', 'ಹೊಲಿಗೆ, ಯಂತ್ರ ಹೊಲಿಗೆ', 'ಸ್ವಂತ ಹೊಲಿಗೆ ಅಂಗಡಿ ಪ್ರಾರಂಭಿಸುವುದು', 'ಸ್ಥಳೀಯ ಜಿಲ್ಲೆ ಮಾತ್ರ', 'ಸ್ವ-ಉದ್ಯೋಗ', 'ಗ್ರಾಮೀಣ ಸೇಲಂ']
};

function simulateStepVoiceAnswer() {
    const lang = OnboardingController.language || currentAppLang || 'en-IN';
    const step = OnboardingController.currentStep || 1;
    const samples = STEP_SAMPLE_ANSWERS[lang] || STEP_SAMPLE_ANSWERS['en-IN'];
    const ans = samples[step - 1] || samples[0];

    const tEl = document.getElementById('ob-ptt-transcript');
    if (tEl) {
        tEl.value = ans;
    }
    handlePttTranscriptInput(ans);
}

function startPtt() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const ring = document.getElementById('ob-ptt-ring');
    const label = document.getElementById('ob-ptt-label');
    const icon = document.getElementById('ob-ptt-icon');
    const hint = document.getElementById('ob-ptt-hint');
    const tEl = document.getElementById('ob-ptt-transcript');
    const errEl = document.getElementById('ob-error');

    if (errEl) errEl.textContent = '';

    if (!SR) {
        if (errEl) errEl.textContent = 'ℹ️ Web speech recognition not available in this browser. Using sample voice response.';
        simulateStepVoiceAnswer();
        return;
    }

    if (OnboardingController.pttActive) return;

    OnboardingController.pttActive = true;
    if (ring) ring.classList.add('ptt-active');
    if (label) label.textContent = '🔴 Listening...';
    if (icon) icon.textContent = '🎙️';
    if (hint) hint.textContent = 'Tap to stop or release when finished speaking';

    if (window.speechSynthesis) window.speechSynthesis.cancel();

    try {
        const recognition = new SR();
        recognition.lang = OnboardingController.language || 'en-IN';
        recognition.interimResults = true;
        recognition.continuous = true;
        OnboardingController.pttRecognition = recognition;

        recognition.onresult = (e) => {
            let interim = '', final = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                if (e.results[i].isFinal) final += e.results[i][0].transcript;
                else interim += e.results[i][0].transcript;
            }
            const recognized = (final || interim).trim();
            if (tEl && recognized) {
                tEl.value = recognized;
            }
            if (final) {
                handlePttTranscriptInput(final);
            } else if (interim) {
                handlePttTranscriptInput(interim);
            }
        };

        recognition.onerror = (e) => {
            console.warn('SpeechRecognition error:', e);
            if (e.error === 'not-allowed') {
                if (errEl) errEl.textContent = '⚠️ Microphone permission denied. Please allow mic access or type answer.';
            }
            stopPtt();
        };

        recognition.onend = () => {
            stopPtt();
        };

        recognition.start();
    } catch(e) {
        console.error('Failed to start SpeechRecognition:', e);
        stopPtt();
        if (errEl) errEl.textContent = '⚠️ Microphone error. You can type or click Sample Answer.';
    }
}

function stopPtt() {
    OnboardingController.pttActive = false;
    const ring = document.getElementById('ob-ptt-ring');
    const label = document.getElementById('ob-ptt-label');
    const icon = document.getElementById('ob-ptt-icon');
    const hint = document.getElementById('ob-ptt-hint');

    if (ring) ring.classList.remove('ptt-active');
    if (label) label.textContent = getTranslation('ptt_hold_speak') || 'Tap / Hold to Speak';
    if (icon) icon.textContent = '🎤';
    if (hint) hint.textContent = getTranslation('ptt_release_submit') || 'Click or hold to speak in selected language';

    if (OnboardingController.pttRecognition) {
        try { OnboardingController.pttRecognition.stop(); } catch(e){}
    }
}

function ivrKey(char) {
    const el = document.getElementById('ob-ivr-input');
    if (el) el.textContent += char;
}
function ivrBackspace() {
    const el = document.getElementById('ob-ivr-input');
    if (el) el.textContent = el.textContent.slice(0, -1);
}
function ivrClear() {
    const el = document.getElementById('ob-ivr-input');
    if (el) el.textContent = '';
}

// =============================================================================
// 4. MULTILINGUAL PROFILE MODAL (Telugu, Tamil, Hindi, Kannada, English)
// =============================================================================
async function openProfileModal(benId, lang) {
    currentModalBenId = benId;
    const activeLang = lang || currentAppLang || 'en-IN';

    const modal = document.getElementById('profile-modal');
    modal.classList.add('active');

    const switchSelect = document.getElementById('prof-lang-switch');
    if (switchSelect) switchSelect.value = activeLang;

    const body = document.getElementById('profile-modal-body');
    body.innerHTML = '<div class="empty-state">Loading localized profile...</div>';

    try {
        const res = await fetch(`/api/beneficiary?id=${encodeURIComponent(benId)}&lang=${encodeURIComponent(activeLang)}`);
        const b = await res.json();

        if (b.error) {
            body.innerHTML = `<div class="empty-state">❌ ${b.error}</div>`;
            return;
        }

        document.getElementById('prof-modal-name').textContent = b.name;
        document.getElementById('prof-modal-id').textContent = b.id;

        const L = b.labels;

        let recsHtml = '';
        if (b.recommendedPrograms && b.recommendedPrograms.length > 0) {
            recsHtml = b.recommendedPrograms.map(r => `
                <div class="prof-rec-card">
                    <div class="prof-rec-header">
                        <span>🎓 ${escapeHtml(r.programName)}</span>
                        <span class="badge badge-success">Match: ${r.score} pts</span>
                    </div>
                    <div class="prof-rec-meta">
                        <span><strong>NSQF Level:</strong> ${r.nsqfLevel}</span>
                        <span><strong>Duration:</strong> ${r.duration}</span>
                        <span><strong>Region:</strong> ${escapeHtml(r.region)}</span>
                    </div>
                </div>
            `).join('');
        } else {
            recsHtml = '<div class="empty-state">No specific training program generated yet.</div>';
        }

        body.innerHTML = `
            <div class="prof-meta-grid">
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.name)}</div>
                    <div class="p-value">${escapeHtml(b.name)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.phone)}</div>
                    <div class="p-value">${escapeHtml(b.phone)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.education)}</div>
                    <div class="p-value">${escapeHtml(b.education)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.currentLivelihood)}</div>
                    <div class="p-value">${escapeHtml(b.currentLivelihood)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.familyOccupation)}</div>
                    <div class="p-value">${escapeHtml(b.familyOccupation)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.employmentPreference)}</div>
                    <div class="p-value">${escapeHtml(b.employmentPreference)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.skills)}</div>
                    <div class="p-value">${escapeHtml(b.skills)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.interests)}</div>
                    <div class="p-value">${escapeHtml(b.interests)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.aspirations)}</div>
                    <div class="p-value">${escapeHtml(b.aspirations)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.constraints)}</div>
                    <div class="p-value">${escapeHtml(b.constraints)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.region)}</div>
                    <div class="p-value">${escapeHtml(b.region)}</div>
                </div>
                <div class="prof-detail-box">
                    <div class="p-label">${escapeHtml(L.status)}</div>
                    <div class="p-value"><span class="badge ${getStatusBadgeClass(b.status)}">${escapeHtml(b.status)}</span></div>
                </div>
            </div>

            <div class="prof-section-title">
                <span>🎯</span>
                <span>${escapeHtml(L.recommendedTraining)}</span>
            </div>
            <div class="prof-recs-grid">
                ${recsHtml}
            </div>
        `;

    } catch(err) {
        body.innerHTML = '<div class="empty-state">Failed to load beneficiary profile.</div>';
    }
}

function switchProfileModalLanguage(lang) {
    if (currentModalBenId) {
        openProfileModal(currentModalBenId, lang);
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    modal.classList.remove('active');
    currentModalBenId = null;
}

function generateRoadmapForModalBen() {
    if (currentModalBenId) {
        closeProfileModal();
        switchTab('roadmap');
        const sel = document.getElementById('roadmap-ben-select');
        if (sel) {
            sel.value = currentModalBenId;
            loadPersonalRoadmap();
        }
    }
}

// =============================================================================
// 5. REGISTRATION FORM, PROFILES & CATALOGS
// =============================================================================
async function handleRegistration(e) {
    e.preventDefault();

    const payload = {
        name: document.getElementById('reg-name').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        language: document.getElementById('reg-lang').value,
        education: document.getElementById('reg-edu').value,
        familyOccupation: document.getElementById('reg-famocc').value.trim(),
        currentLivelihood: document.getElementById('reg-curliv').value.trim(),
        skills: document.getElementById('reg-skills').value.trim(),
        interests: document.getElementById('reg-interests').value.trim(),
        aspirations: document.getElementById('reg-aspirations').value.trim(),
        constraints: document.getElementById('reg-constraints').value.trim(),
        employmentPreference: document.getElementById('reg-emppref').value,
        region: document.getElementById('reg-region').value.trim()
    };

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            alert(`✓ Beneficiary Registered Successfully!\nAssigned ID: ${data.id}\nSaved to SQLite saathi.db`);
            document.getElementById('reg-form').reset();
            loadDashboard();
            loadBeneficiaries();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        alert('Failed to connect to server.');
    }
}

async function loadBeneficiaries() {
    try {
        const res = await fetch('/api/beneficiaries');
        allBeneficiaries = await res.json();
        renderProfileList(allBeneficiaries);
        populateDropdowns(allBeneficiaries);
    } catch (err) {
        console.error(err);
    }
}

function renderProfileList(list) {
    const container = document.getElementById('profile-list');
    container.innerHTML = '';
    const dict = I18N[currentAppLang] || I18N['en-IN'];

    if (!list || list.length === 0) {
        container.innerHTML = `<div class="empty-state">${dict.no_beneficiaries || 'No beneficiaries registered yet.'}</div>`;
        return;
    }

    list.forEach(b => {
        const item = document.createElement('div');
        item.className = 'profile-list-item';
        item.style.padding = '12px';
        item.style.borderBottom = '1px solid #e2e8f0';
        item.style.cursor = 'pointer';
        item.onclick = () => showProfileDetail(b);
        const localizedStatus = getLocalizedStatus(b.status);
        item.innerHTML = `
            <div class="p-name" style="font-weight:700; color:var(--text-main);">${escapeHtml(b.name)} <small style="color:var(--text-muted);">(${b.id})</small></div>
            <div class="p-meta" style="font-size:12px; color:var(--text-muted); margin-top:2px;">📍 ${escapeHtml(b.region)} | 📞 ${escapeHtml(b.phone)}</div>
            <div class="badge ${getStatusBadgeClass(b.status)} mt-5">${escapeHtml(localizedStatus)}</div>
        `;
        container.appendChild(item);
    });
}

function showProfileDetail(b) {
    const detail = document.getElementById('profile-detail');
    const dict = I18N[currentAppLang] || I18N['en-IN'];
    const localizedStatus = getLocalizedStatus(b.status);

    detail.innerHTML = `
        <div class="profile-card-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h4>${escapeHtml(b.name)} <span class="badge badge-indigo">${b.id}</span></h4>
            <span class="badge ${getStatusBadgeClass(b.status)}">${escapeHtml(localizedStatus)}</span>
        </div>
        <div class="profile-card-body" style="font-size:13px; display:flex; flex-direction:column; gap:6px;">
            <div><strong>${dict.lbl_lang || 'Language'}:</strong> ${escapeHtml(b.language)}</div>
            <div><strong>${dict.lbl_phone || 'Phone'}:</strong> ${escapeHtml(b.phone)}</div>
            <div><strong>${dict.lbl_edu || 'Education'}:</strong> ${escapeHtml(b.education)}</div>
            <div><strong>${dict.lbl_curliv || 'Current Livelihood'}:</strong> ${escapeHtml(b.currentLivelihood)}</div>
            <div><strong>${dict.lbl_famocc || 'Family Occupation'}:</strong> ${escapeHtml(b.familyOccupation)}</div>
            <div><strong>${dict.lbl_skills || 'Skills'}:</strong> ${escapeHtml(b.skills)}</div>
            <div><strong>${dict.lbl_interests || 'Interests'}:</strong> ${escapeHtml(b.interests)}</div>
            <div><strong>${dict.lbl_aspirations || 'Aspirations'}:</strong> ${escapeHtml(b.aspirations)}</div>
            <div><strong>${dict.lbl_constraints || 'Constraints'}:</strong> ${escapeHtml(b.constraints)}</div>
            <div><strong>${dict.lbl_emppref || 'Employment Pref'}:</strong> ${escapeHtml(b.employmentPreference)}</div>
            <div><strong>${dict.lbl_region || 'Region'}:</strong> ${escapeHtml(b.region)}</div>
            <div><strong>${dict.lbl_registered || 'Registered'}:</strong> ${b.registrationDate}</div>
        </div>
        <div style="margin-top:14px; display:flex; gap:8px;">
            <button class="btn btn-primary btn-sm" onclick="openProfileModal('${b.id}')">${dict.btn_full_profile || '👁️ Full Multilingual Profile'}</button>
            <button class="btn btn-secondary btn-sm" onclick="openStatusModal('${b.id}')">${dict.btn_update_status || '✏️ Update Pipeline Status'}</button>
        </div>
    `;
}

function filterProfilesLive() {
    const q = document.getElementById('profile-search').value.toLowerCase();
    const filtered = allBeneficiaries.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.id.toLowerCase().includes(q) || 
        b.region.toLowerCase().includes(q)
    );
    renderProfileList(filtered);
}

// =============================================================================
// 6. RECOMMENDATIONS, ROADMAP & CATALOGS
// =============================================================================
function populateDropdowns(list) {
    const selects = [
        document.getElementById('training-ben-select'),
        document.getElementById('job-ben-select'),
        document.getElementById('roadmap-ben-select'),
        document.getElementById('chat-ben-select')
    ];

    selects.forEach(sel => {
        if (!sel) return;
        const currentVal = sel.value;
        sel.innerHTML = sel.id === 'chat-ben-select' ? '<option value="">No Beneficiary Context</option>' : '';

        list.forEach(b => {
            const opt = document.createElement('option');
            opt.value = b.id;
            opt.textContent = `${b.name} (${b.id}) - ${b.region}`;
            sel.appendChild(opt);
        });

        if (currentVal) sel.value = currentVal;
    });
}

let currentCatalogType = 'tp';

async function runTrainingRecommendations() {
    const benId = document.getElementById('training-ben-select').value;
    const dict = I18N[currentAppLang] || I18N['en-IN'];
    if (!benId) return alert(dict.alert_select_ben || 'Please select a beneficiary.');

    const container = document.getElementById('training-results');
    container.innerHTML = `<div class="empty-state">${dict.tr_running || 'Running AI Recommendation Algorithm...'}</div>`;

    try {
        const res = await fetch(`/api/recommendations/training?id=${benId}`);
        const data = await res.json();

        if (!data || data.length === 0) {
            container.innerHTML = `<div class="empty-state">${dict.tr_no_rec || 'No matching training programs found.'}</div>`;
            return;
        }

        const l = currentAppLang || 'en-IN';
        const topMatchLabel = l === 'te-IN' ? '⭐ ఉత్తమ సిఫార్సు' : l === 'hi-IN' ? '⭐ शीर्ष अनुशंसित कार्यक्रम' : l === 'ta-IN' ? '⭐ சிறந்த பரிந்துரை' : l === 'kn-IN' ? '⭐ ಪ್ರಮುಖ ಶಿಫಾರಸು' : '⭐ Top Recommended Match';
        const matchIndexLabel = l === 'te-IN' ? 'సరిపోలిక సూచిక' : l === 'hi-IN' ? 'मैच इंडेक्स' : l === 'ta-IN' ? 'பொருத்த குறியீடு' : l === 'kn-IN' ? 'ಹೊಂದಾಣಿಕೆ ಸೂಚ್ಯಂಕ' : 'Match Index';
        const schemeLinkageLabel = l === 'te-IN' ? 'ప్రభుత్వ పథకం: PM-DAKSH / PMKVY 4.0 (100% ఉచిత శిక్షణ + స్టైపెండ్)' : l === 'hi-IN' ? 'सरकारी योजना: पीएम-दक्ष / पीएमकेवीवाई 4.0 (100% निःशुल्क + वजीफा)' : l === 'ta-IN' ? 'அரசு திட்டம்: PM-DAKSH / PMKVY 4.0 (100% இலவசம் + உதவித்தொகை)' : l === 'kn-IN' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆ: PM-DAKSH / PMKVY 4.0 (100% ಉಚಿತ + ವಿದ್ಯಾರ್ಥಿವೇತನ)' : 'Scheme Linkage: PM-DAKSH / PMKVY 4.0 (100% Free + Stipend)';
        const rationalesTitle = l === 'te-IN' ? '🎯 AI సరిపోలిక కారణాలు & ఆర్థిక ప్రయోజనాలు:' : l === 'hi-IN' ? '🎯 एआई मिलान के कारण और आर्थिक औचित्य:' : l === 'ta-IN' ? '🎯 AI பொருத்த காரணங்கள் & பொருளாதார பலன்கள்:' : l === 'kn-IN' ? '🎯 AI ಹೊಂದಾಣಿಕೆಯ ಕಾರಣಗಳು ಮತ್ತು ಆರ್ಥಿಕ ಪ್ರಯೋಜನಗಳು:' : '🎯 AI Match Rationales & Economic Justification:';
        const viewRoadmapBtnLabel = l === 'te-IN' ? '🗺️ వ్యక్తిగత ఉపాధి ప్రణాళిక చూడండి →' : l === 'hi-IN' ? '🗺️ व्यक्तिगत रोडमैप देखें →' : l === 'ta-IN' ? '🗺️ தனிப்பயனாக்கப்பட்ட வரைபடம் பார்க்க →' : l === 'kn-IN' ? '🗺️ ವೈಯಕ್ತಿಕ ಮಾರ್ಗಸೂಚಿ ನೋಡಿ →' : '🗺️ View Personalized Roadmap →';

        container.innerHTML = data.map((recRaw, i) => {
            const rec = typeof getLocalizedProgram === 'function' ? getLocalizedProgram(recRaw, l) : recRaw;
            const score = rec.score || 0;
            const isTop = i === 0;
            const scoreColor = score >= 70 ? '#10b981' : score >= 50 ? '#3b82f6' : '#f59e0b';
            const empType = rec.type || rec.employmentType || 'Wage / Self-Employment';
            const isSelf = empType.toLowerCase().includes('self') || empType.includes('స్వయం') || empType.includes('स्व');
            const localizedReasons = (recRaw.reasons || []).map(r => typeof getLocalizedReason === 'function' ? getLocalizedReason(r, l) : r);

            return `
            <div class="rec-card ${isTop ? 'top-match' : ''}" style="border: 1px solid ${isTop ? '#6366f1' : '#e2e8f0'}; background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: ${isTop ? '0 4px 14px rgba(99,102,241,0.12)' : '0 2px 6px rgba(0,0,0,0.04)'}; position: relative;">
                ${isTop ? `<div style="position:absolute; top:-10px; right:20px; background:#6366f1; color:#fff; font-size:11px; font-weight:700; padding:3px 12px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px;">${topMatchLabel}</div>` : ''}
                
                <div class="rec-header" style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:10px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
                            <span class="badge badge-info" style="font-size:11px; font-weight:700;">${escapeHtml(rec.id || rec.trainingId)}</span>
                            <span class="badge" style="background:#e0e7ff; color:#4338ca; font-weight:700; font-size:11px;">NSQF Level ${rec.nsqfLevel}</span>
                            <span class="badge ${isSelf ? 'badge-primary' : 'badge-success'}" style="font-size:11px;">${escapeHtml(empType)}</span>
                        </div>
                        <h4 style="font-size:16px; font-weight:700; color:var(--text-main); margin:0;">${escapeHtml(rec.name || rec.programName)}</h4>
                    </div>
                    <div style="text-align:right; flex-shrink:0;">
                        <div style="font-size:18px; font-weight:800; color:${scoreColor};">★ ${score}<span style="font-size:12px; font-weight:500; color:#64748b;">/100</span></div>
                        <div style="font-size:11px; font-weight:600; color:#64748b;">${matchIndexLabel}</div>
                    </div>
                </div>

                <div class="rec-meta" style="font-size:12px; color:#64748b; background:#f8fafc; padding:8px 12px; border-radius:8px; margin:8px 0 12px 0; display:flex; gap:16px; flex-wrap:wrap;">
                    <span>⏱️ <strong>${dict.th_duration || 'Duration'}:</strong> ${escapeHtml(rec.duration)}</span>
                    <span>📍 <strong>${dict.th_region || 'Region'}:</strong> ${escapeHtml(rec.region)}</span>
                    <span>📜 <strong>${schemeLinkageLabel}</strong></span>
                </div>

                <div class="rec-desc" style="font-size:13px; line-height:1.5; color:#334155; margin-bottom:12px;">${escapeHtml(rec.description)}</div>

                <div class="rec-reasons" style="font-size:12px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px;">
                    <strong style="color:#166534; display:block; margin-bottom:6px;">${rationalesTitle}</strong>
                    <ul style="margin:0; padding-left:18px; color:#15803d; line-height:1.6;">
                        ${localizedReasons.map(r => `<li><strong>✓</strong> ${escapeHtml(r)}</li>`).join('')}
                    </ul>
                </div>

                <div style="margin-top:14px; display:flex; justify-content:flex-end; gap:10px;">
                    <button class="btn btn-outline" style="font-size:12px; padding:6px 14px;" onclick="goToRoadmapFor('${escapeHtml(benId)}')">${viewRoadmapBtnLabel}</button>
                </div>
            </div>
            `;
        }).join('');

        loadDashboard();
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="empty-state">${dict.err_training || 'Error generating recommendations.'}</div>`;
    }
}

async function runJobRecommendations() {
    const benId = document.getElementById('job-ben-select').value;
    const dict = I18N[currentAppLang] || I18N['en-IN'];
    if (!benId) return alert(dict.alert_select_ben || 'Please select a beneficiary.');

    const container = document.getElementById('job-results');
    container.innerHTML = `<div class="empty-state">${dict.jb_matching || 'Matching with Local Opportunities...'}</div>`;

    try {
        const res = await fetch(`/api/recommendations/jobs?id=${benId}`);
        const data = await res.json();

        if (!data || data.length === 0) {
            container.innerHTML = `<div class="empty-state">${dict.jb_no_opp || 'No matching job opportunities found.'}</div>`;
            return;
        }

        const l = currentAppLang || 'en-IN';
        const topJobLabel = l === 'te-IN' ? '💼 అత్యధిక ఉద్యోగ నియామక సంభావ్యత' : l === 'hi-IN' ? '💼 उच्चतम प्लेसमेंट संभावना' : l === 'ta-IN' ? '💼 அதிக வேலைவாய்ப்பு சாத்தியம்' : l === 'kn-IN' ? '💼 ಗರಿಷ್ಠ ಉದ್ಯೋಗಾವಕಾಶ ಸಾಧ್ಯತೆ' : '💼 Highest Placement Probability';
        const readinessLabel = l === 'te-IN' ? 'సన్నద్ధత స్కోరు' : l === 'hi-IN' ? 'तैयारी स्कोर' : l === 'ta-IN' ? 'தயார்நிலை மதிப்பெண்' : l === 'kn-IN' ? 'ಸಿದ್ಧತೆಯ ಸ್ಕೋರ್' : 'Readiness Score';
        const alignmentTitle = l === 'te-IN' ? '📈 ఉపాధి అమరిక & రుణ సదుపాయం:' : l === 'hi-IN' ? '📈 आजीविका तालमेल और ऋण सुविधा:' : l === 'ta-IN' ? '📈 வாழ்வாதார சீரமைப்பு மற்றும் கடன் உதவி:' : l === 'kn-IN' ? '📈 ಜೀವನೋಪಾಯ ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಸಾಲ ಸೌಲಭ್ಯ:' : '📈 Livelihood Alignment & Credit Facilitation:';
        const viewRoadmapBtnLabel = l === 'te-IN' ? '🗺️ వ్యక్తిగత ఉపాధి ప్రణాళిక చూడండి →' : l === 'hi-IN' ? '🗺️ व्यक्तिगत रोडमैप देखें →' : l === 'ta-IN' ? '🗺️ தனிப்பயனாக்கப்பட்ட வரைபடம் பார்க்க →' : l === 'kn-IN' ? '🗺️ ವೈಯಕ್ತಿಕ ಮಾರ್ಗಸೂಚಿ ನೋಡಿ →' : '🗺️ View Personalized Roadmap →';

        container.innerHTML = data.map((recRaw, i) => {
            const rec = typeof getLocalizedOpportunity === 'function' ? getLocalizedOpportunity(recRaw, l) : recRaw;
            const score = rec.score || 0;
            const isTop = i === 0;
            const scoreColor = score >= 70 ? '#10b981' : score >= 50 ? '#3b82f6' : '#f59e0b';
            const isSelf = (rec.type || '').toLowerCase().includes('self') || (rec.type || '').includes('స్వయం') || (rec.type || '').includes('स्व');
            const localizedReasons = (recRaw.reasons || []).map(r => typeof getLocalizedReason === 'function' ? getLocalizedReason(r, l) : r);

            return `
            <div class="rec-card ${isTop ? 'top-match' : ''}" style="border: 1px solid ${isTop ? '#10b981' : '#e2e8f0'}; background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: ${isTop ? '0 4px 14px rgba(16,185,129,0.12)' : '0 2px 6px rgba(0,0,0,0.04)'}; position: relative;">
                ${isTop ? `<div style="position:absolute; top:-10px; right:20px; background:#10b981; color:#fff; font-size:11px; font-weight:700; padding:3px 12px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px;">${topJobLabel}</div>` : ''}
                
                <div class="rec-header" style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:10px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
                            <span class="badge badge-info" style="font-size:11px; font-weight:700;">${escapeHtml(rec.id || rec.opportunityId)}</span>
                            <span class="badge ${isSelf ? 'badge-primary' : 'badge-success'}" style="font-size:11px; font-weight:700;">${escapeHtml(rec.type)}</span>
                            <span class="badge" style="background:#f1f5f9; color:#475569; font-size:11px;">📍 ${escapeHtml(rec.region)}</span>
                        </div>
                        <h4 style="font-size:16px; font-weight:700; color:var(--text-main); margin:0;">${escapeHtml(rec.name || rec.opportunityName)}</h4>
                    </div>
                    <div style="text-align:right; flex-shrink:0;">
                        <div style="font-size:18px; font-weight:800; color:${scoreColor};">★ ${score}<span style="font-size:12px; font-weight:500; color:#64748b;">/100</span></div>
                        <div style="font-size:11px; font-weight:600; color:#64748b;">${readinessLabel}</div>
                    </div>
                </div>

                <div class="rec-meta" style="font-size:12px; color:#475569; background:#f8fafc; padding:8px 12px; border-radius:8px; margin:8px 0 12px 0;">
                    <div>🔧 <strong>${dict.th_req_skill || 'Key Competencies'}:</strong> <span style="color:#0f172a; font-weight:600;">${escapeHtml(rec.requiredSkill)}</span></div>
                </div>

                <div class="rec-desc" style="font-size:13px; line-height:1.5; color:#334155; margin-bottom:12px;">${escapeHtml(rec.description)}</div>

                <div class="rec-reasons" style="font-size:12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px 14px;">
                    <strong style="color:#1e40af; display:block; margin-bottom:6px;">${alignmentTitle}</strong>
                    <ul style="margin:0; padding-left:18px; color:#1d4ed8; line-height:1.6;">
                        ${localizedReasons.map(r => `<li><strong>✓</strong> ${escapeHtml(r)}</li>`).join('')}
                    </ul>
                </div>

                <div style="margin-top:14px; display:flex; justify-content:flex-end; gap:10px;">
                    <button class="btn btn-outline" style="font-size:12px; padding:6px 14px;" onclick="goToRoadmapFor('${escapeHtml(benId)}')">${viewRoadmapBtnLabel}</button>
                </div>
            </div>
            `;
        }).join('');

        loadDashboard();
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="empty-state">${dict.err_jobs || 'Error generating job matches.'}</div>`;
    }
}

function goToRoadmapFor(benId) {
    switchTab('roadmap');
    const sel = document.getElementById('roadmap-ben-select');
    if (sel) {
        sel.value = benId;
        loadPersonalRoadmap();
    }
}

async function loadPersonalRoadmap() {
    const benId = document.getElementById('roadmap-ben-select').value;
    const dict = I18N[currentAppLang] || I18N['en-IN'];
    if (!benId) return alert(dict.alert_select_ben || 'Please select a beneficiary.');

    const container = document.getElementById('roadmap-results');
    container.innerHTML = `<div class="empty-state">${dict.rm_generating || 'Generating Personalized Livelihood Roadmap...'}</div>`;

    try {
        const res = await fetch(`/api/roadmap?id=${benId}`);
        const data = await res.json();

        if (!data || !data.beneficiary) {
            container.innerHTML = `<div class="empty-state">${dict.rm_error || 'Could not generate roadmap for this beneficiary.'}</div>`;
            return;
        }

        const l = currentAppLang || 'en-IN';
        const b = data.beneficiary;
        
        // Localize target program and target role
        const rawTP = { id: data.targetProgramId, name: data.targetProgram, duration: data.duration, description: data.targetProgramDescription, type: data.employmentType };
        const localizedTP = typeof getLocalizedProgram === 'function' ? getLocalizedProgram(rawTP, l) : rawTP;
        const rawOpp = { id: data.targetRoleId, name: data.targetRole, type: data.targetRoleType || data.targetType, requiredSkill: data.targetRoleRequiredSkill, description: data.targetRoleDescription };
        const localizedOpp = typeof getLocalizedOpportunity === 'function' ? getLocalizedOpportunity(rawOpp, l) : rawOpp;

        const gaps = data.skillGaps || [];
        const hasGaps = gaps.length > 0;
        const targetProg = localizedTP.name || data.targetProgram || 'Vocational Training Program';
        const targetRole = localizedOpp.name || data.targetRole || 'Livelihood Opportunity';
        const targetType = localizedOpp.type || data.targetType || 'Gainful Employment';
        const duration = localizedTP.duration || data.duration || '3 Months';
        const nsqfLvl = data.nsqfLevel || 4;
        const isSelf = targetType.toLowerCase().includes('self') || targetType.includes('స్వయం') || targetType.includes('स्व');

        // Multi-language strings for Roadmap
        const roadmapTitle = l === 'te-IN' ? `🗺️ 6-దశల ఉపాధి రూపాంతర ప్రణాళిక: ${b.name}` : l === 'hi-IN' ? `🗺️ 6-चरणीय आजीविका परिवर्तन योजना: ${b.name}` : l === 'ta-IN' ? `🗺️ 6-படி வாழ்வாதார மாற்றத் திட்டம்: ${b.name}` : l === 'kn-IN' ? `🗺️ 6-ಹಂತಗಳ ಜೀವನೋಪಾಯ ರೂಪಾಂತರ ಯೋಜನೆ: ${b.name}` : `🗺️ 6-Stage Livelihood Transformation Plan: ${b.name}`;
        const trackLabel = l === 'te-IN' ? 'ఉపాధి మార్గం:' : l === 'hi-IN' ? 'रोजगार ट्रैक:' : l === 'ta-IN' ? 'வேலைவாய்ப்பு பாதை:' : l === 'kn-IN' ? 'ಉದ್ಯೋಗ ಮಾರ್ಗ:' : 'Employment Track:';
        const recCourseLabel = l === 'te-IN' ? '🎯 సిఫార్సు చేయబడిన NSQF కోర్సు:' : l === 'hi-IN' ? '🎯 अनुशंसित NSQF पाठ्यक्रम:' : l === 'ta-IN' ? '🎯 பரிந்துரைக்கப்பட்ட NSQF படிப்பு:' : l === 'kn-IN' ? '🎯 ಶಿಫಾರಸು ಮಾಡಲಾದ NSQF ಕೋರ್ಸ್:' : '🎯 Recommended NSQF Course:';
        const targetRoleLabel = l === 'te-IN' ? '💼 లక్ష్య ఉపాధి పాత్ర:' : l === 'hi-IN' ? '💼 लक्षित आजीविका भूमिका:' : l === 'ta-IN' ? '💼 இலக்கு வேலைவாய்ப்பு பணி:' : l === 'kn-IN' ? '💼 ಗುರಿ ಜೀವನೋಪಾಯದ ಪಾತ್ರ:' : '💼 Target Livelihood Role:';
        const estTimelineLabel = l === 'te-IN' ? '⏱️ అంచనా సమయం:' : l === 'hi-IN' ? '⏱️ अनुमानित समयरेखा:' : l === 'ta-IN' ? '⏱️ மதிப்பிடப்பட்ட கால அளவு:' : l === 'kn-IN' ? '⏱️ ಅಂದಾಜು ಕಾಲಾವಧಿ:' : '⏱️ Estimated Timeline:';
        const gapsLabel = l === 'te-IN' ? '🔍 గుర్తించిన నైపుణ్య లోపాలు:' : l === 'hi-IN' ? '🔍 पहचाने गए कौशल अंतराल:' : l === 'ta-IN' ? '🔍 கண்டறியப்பட்ட திறன் இடைவெளிகள்:' : l === 'kn-IN' ? '🔍 ಗುರುತಿಸಲಾದ ಕೌಶಲ್ಯ ಅಂತರಗಳು:' : '🔍 Identified Skill Gap Competencies:';
        const fullyQualifiedLabel = l === 'te-IN' ? '✓ ప్రస్తుత నైపుణ్యాలు సరిపోతాయి (పూర్తి అర్హత ఉంది)' : l === 'hi-IN' ? '✓ मूलभूत दक्षताएं पूरी तरह योग्य हैं' : l === 'ta-IN' ? '✓ அடிப்படைத் திறன்கள் முழுமையாக தகுதி பெற்றுள்ளன' : l === 'kn-IN' ? '✓ ಮೂಲಭೂತ ಕೌಶಲ್ಯಗಳು ಸಂಪೂರ್ಣ ಅರ್ಹವಾಗಿವೆ' : '✓ Baseline Competencies Fully Qualified';
        const enrollBtnLabel = l === 'te-IN' ? 'కోర్సులో నమోదును నిర్ధారించండి' : l === 'hi-IN' ? 'पाठ्यक्रम नामांकन की पुष्टि करें' : l === 'ta-IN' ? 'பயிற்சியில் சேர்வதை உறுதிசெய்க' : l === 'kn-IN' ? 'ಕೋರ್ಸ್ ನೋಂದಣಿಯನ್ನು ದೃಢೀಕರಿಸಿ' : 'Confirm Course Enrollment';

        // Stage 1
        const s1Title = l === 'te-IN' ? 'బేస్‌లైన్ అసెస్‌మెంట్ & ప్రొఫైలింగ్' : l === 'hi-IN' ? 'आधारभूत मूल्यांकन और प्रोफाइलिंग' : l === 'ta-IN' ? 'அடிப்படை மதிப்பீடு மற்றும் விவரக்குறிப்பு' : l === 'kn-IN' ? 'ಮೂಲಭೂತ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ವಿವರಣೆ' : 'Baseline Assessment & Demographic Profiling';
        const s1Desc = l === 'te-IN' ? `లబ్ధిదారుడు విద్యార్హత (<strong>${escapeHtml(b.education || '10వ/12వ')}</strong>), ధృవీకరించబడిన నైపుణ్యాలు (<strong>${escapeHtml(b.skills)}</strong>), మరియు ఆశయాలు (<strong>${escapeHtml(b.aspirations || 'ఉపాధి')}</strong>) తో నమోదు చేయబడ్డారు.` : l === 'hi-IN' ? `लाभार्थी शिक्षा (<strong>${escapeHtml(b.education || 'माध्यमिक')}</strong>), सत्यापित कौशल (<strong>${escapeHtml(b.skills)}</strong>) और आकांक्षाओं के साथ पंजीकृत है।` : l === 'ta-IN' ? `பயனாளி கல்வித்தகுதி (<strong>${escapeHtml(b.education || 'பத்தாம்/பன்னிரண்டாம்')}</strong>), திறன்கள் (<strong>${escapeHtml(b.skills)}</strong>) மற்றும் விருப்பங்களுடன் பதிவு செய்யப்பட்டுள்ளார்.` : l === 'kn-IN' ? `ಫಲಾನುಭವಿಯು ಶಿಕ್ಷಣ (<strong>${escapeHtml(b.education || 'ಪ್ರಾಥಮಿಕ/ಪ್ರೌಢ')}</strong>), ಕೌಶಲ್ಯಗಳು (<strong>${escapeHtml(b.skills)}</strong>) ಮತ್ತು ಆಕಾಂಕ್ಷೆಗಳೊಂದಿಗೆ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದ್ದಾರೆ.` : `Beneficiary registered with baseline education (<strong>${escapeHtml(b.education || 'Primary/Secondary')}</strong>), verified skills (<strong>${escapeHtml(b.skills)}</strong>), and expressed aspiration (<strong>${escapeHtml(b.aspirations || 'Gainful Employment')}</strong>).`;

        // Stage 2
        const s2Title = l === 'te-IN' ? 'NSQF ప్రమాణాల ప్రకారం AI నైపుణ్యాల గ్యాప్ విశ్లేషణ' : l === 'hi-IN' ? 'NSQF मानकों के अनुसार AI कौशल अंतराल विश्लेषण' : l === 'ta-IN' ? 'NSQF தரநிலைகளின்படி AI திறன் இடைவெளி பகுப்பாய்வு' : l === 'kn-IN' ? 'NSQF ಮಾನದಂಡಗಳ ಪ್ರಕಾರ AI ಕೌಶಲ್ಯ ಅಂತರ ವಿಶ್ಲೇಷಣೆ' : 'AI Diagnostic Gap Analysis vs. NSQF Standards';
        const s2Desc = l === 'te-IN' ? `మల్టీ-క్రైటీరియా విశ్లేషణ ద్వారా <strong>${escapeHtml(targetProg)} (NSQF L${nsqfLvl})</strong> సరిపోలింది. ${hasGaps ? `నేర్చుకోవాల్సిన నైపుణ్యాలు: <em>${escapeHtml(gaps.join(', '))}</em>.` : 'నేరుగా అర్హత సాధించడానికి పూర్తి నైపుణ్యాలు ఉన్నాయి.'}` : l === 'hi-IN' ? `बहु-मानदंड मूल्यांकन द्वारा <strong>${escapeHtml(targetProg)} (NSQF L${nsqfLvl})</strong> का चयन हुआ। ${hasGaps ? `सीखने योग्य कौशल: <em>${escapeHtml(gaps.join(', '))}</em>.` : 'प्रत्यक्ष योग्यता के लिए पूर्ण कौशल उपलब्ध हैं।'}` : l === 'ta-IN' ? `பயனாளியின் விவரங்கள் <strong>${escapeHtml(targetProg)} (NSQF L${nsqfLvl})</strong> உடன் பொருத்தப்பட்டது. ${hasGaps ? `வளர்க்க வேண்டிய திறன்கள்: <em>${escapeHtml(gaps.join(', '))}</em>.` : 'நேரடி தகுதிக்கு முழு திறன்கள் உள்ளன.'}` : l === 'kn-IN' ? `ಮೌಲ್ಯಮಾಪನದ ಮೂಲಕ <strong>${escapeHtml(targetProg)} (NSQF L${nsqfLvl})</strong> ಗೆ ಹೊಂದಿಕೆಯಾಗಿದೆ. ${hasGaps ? `ಕಲಿಯಬೇಕಾದ ಕೌಶಲ್ಯಗಳು: <em>${escapeHtml(gaps.join(', '))}</em>.` : 'ನೇರ ಅರ್ಹತೆಗೆ ಸಂಪೂರ್ಣ ಕೌಶಲ್ಯಗಳಿವೆ.'}` : `Multi-criteria evaluation matched beneficiary to <strong>${escapeHtml(targetProg)} (NSQF L${nsqfLvl})</strong>. ${hasGaps ? `Bridge curriculum identified for: <em>${escapeHtml(gaps.join(', '))}</em>.` : 'Candidate displays full competency match for direct qualification.'}`;

        // Stage 3
        const s3Title = l === 'te-IN' ? 'కోర్సు నమోదు & ప్రభుత్వ స్పాన్సర్‌షిప్ కేటాయింపు' : l === 'hi-IN' ? 'पाठ्यक्रम नामांकन और सरकारी छात्रवृत्ति आवंटन' : l === 'ta-IN' ? 'பயிற்சி சேர்க்கை & அரசு உதவித்தொகை ஒதுக்கீடு' : l === 'kn-IN' ? 'ಕೋರ್ಸ್ ನೋಂದಣಿ ಮತ್ತು ಸರ್ಕಾರಿ ಪ್ರಾಯೋಜಕತ್ವ ಹಂಚಿಕೆ' : 'Course Enrollment & Government Sponsorship Allocation';
        const s3Desc = l === 'te-IN' ? `PM-DAKSH / PMKVY 4.0 పూర్తిగా ఉచిత పథకం కింద <strong>${escapeHtml(targetProg)}</strong> (${escapeHtml(duration)}) లో చేరిక. 100% ట్యూషన్ ఫీజు మినహాయింపు మరియు స్టైపెండ్ సదుపాయం.` : l === 'hi-IN' ? `पीएम-दक्ष / पीएमकेवीवाई 4.0 पूर्णतः प्रायोजित योजना के तहत <strong>${escapeHtml(targetProg)}</strong> (${escapeHtml(duration)}) में नामांकन। 100% ट्यूशन छूट और वजीफा शामिल।` : l === 'ta-IN' ? `PM-DAKSH / PMKVY 4.0 திட்டத்தின் கீழ் <strong>${escapeHtml(targetProg)}</strong> (${escapeHtml(duration)}) பயிற்சியில் சேர்க்கை. 100% இலவச கட்டணம் மற்றும் உதவித்தொகை.` : l === 'kn-IN' ? `PM-DAKSH / PMKVY 4.0 ಯೋಜನೆಯಡಿ <strong>${escapeHtml(targetProg)}</strong> (${escapeHtml(duration)}) ನಲ್ಲಿ ನೋಂದಣಿ. 100% ಶುಲ್ಕ ವಿನಾಯಿತಿ ಮತ್ತು ಸ್ಟೈಪೆಂಡ್ ಸೌಲಭ್ಯ.` : `Enrollment in <strong>${escapeHtml(targetProg)}</strong> (${escapeHtml(duration)}) under PM-DAKSH / PMKVY 4.0 fully sponsored scheme. Includes 100% tuition waiver, digital learning materials, and transport stipend.`;

        // Stage 4
        const s4Title = l === 'te-IN' ? 'ప్రాక్టికల్ శిక్షణ & NSQF స్కిల్ ఇండియా సర్టిఫికేషన్' : l === 'hi-IN' ? 'व्यावहारिक कौशल दक्षता और NSQF स्किल इंडिया प्रमाणन' : l === 'ta-IN' ? 'செய்முறைப் பயிற்சி & NSQF ஸ்கில் இந்தியா சான்றிதழ்' : l === 'kn-IN' ? 'ಪ್ರಾಯೋಗಿಕ ಕೌಶಲ್ಯ ತರಬೇತಿ ಮತ್ತು NSQF ಸ್ಕಿಲ್ ಇಂಡಿಯಾ ಪ್ರಮಾಣೀಕರಣ' : 'Practical Skill Mastery & NSQF Skill India Certification';
        const s4Desc = l === 'te-IN' ? 'ల్యాబ్ ప్రాక్టికల్స్, ఆన్-ది-జాబ్ ట్రైనింగ్ (OJT) మరియు NCVET జాతీయ సర్టిఫికేషన్ పరీక్ష పూర్తి చేయడం.' : l === 'hi-IN' ? 'व्यावहारिक प्रयोगशाला मॉड्यूल, ऑन-द-जॉब प्रशिक्षण (ओजेटी) और औपचारिक एनसीवीईटी प्रमाणन परीक्षा।' : l === 'ta-IN' ? 'செய்முறைப் பயிற்சி, நேரடி வேலைப் பயிற்சி (OJT) மற்றும் NCVET தேசிய சான்றிதழ் தேர்வு நிறைவு செய்தல்.' : l === 'kn-IN' ? 'ಪ್ರಾಯೋಗಿಕ ತರಬೇತಿ, ಆನ್-ದಿ-ಜಾಬ್ ತರಬೇತಿ (OJT) ಮತ್ತು NCVET ರಾಷ್ಟ್ರೀಯ ಪ್ರಮಾಣೀಕರಣ ಪರೀಕ್ಷೆ ಪೂರ್ಣಗೊಳಿಸುವುದು.' : 'Complete laboratory/practical modules, on-the-job training (OJT), and formal National Council for Vocational Education and Training (NCVET) certification exam.';

        // Stage 5
        const s5Title = isSelf 
            ? (l === 'te-IN' ? 'సూక్ష్మ పరిశ్రమ ప్రారంభం & ముద్రా రుణ లింకేజ్' : l === 'hi-IN' ? 'सूक्ष्म उद्यम की शुरुआत और मुद्रा ऋण लिंकेज' : l === 'ta-IN' ? 'குறுந்தொழில் தொடங்குதல் & முத்ரா கடன் உதவி' : l === 'kn-IN' ? 'ಕಿರು-ಉದ್ಯಮ ಪ್ರಾರಂಭ & ಮುದ್ರಾ ಸಾಲ ಸೌಲಭ್ಯ' : 'Micro-Enterprise Launch & Credit Subsidy Linkage')
            : (l === 'te-IN' ? 'ఉద్యోగ నియామకం & పరిశ్రమలో చేరిక' : l === 'hi-IN' ? 'रोजगार प्लेसमेंट और नियोक्ता ऑनबोर्डिंग' : l === 'ta-IN' ? 'வேலைவாய்ப்பு நியமனம் & பணியமர்த்தல்' : l === 'kn-IN' ? 'ಉದ್ಯೋಗ ನಿಯೋಜನೆ ಮತ್ತು ಕಂಪನಿ ಸೇರ್ಪಡೆ' : 'Target Wage Placement & Employer Onboarding');
        const s5Desc = isSelf
            ? (l === 'te-IN' ? `<strong>${escapeHtml(targetRole)}</strong> లో స్వయం ఉపాధి యూనిట్ స్థాపించడానికి PM ముద్రా లోన్ (శిశు/కిషోర్ ₹50,000 నుండి ₹5 లక్షలు) రుణ సదుపాయం.` : l === 'hi-IN' ? `<strong>${escapeHtml(targetRole)}</strong> में इकाई स्थापित करने के लिए पीएम मुद्रा ऋण (शिशु/किशोर ₹50,000 से ₹5 लाख) की सुविधा।` : l === 'ta-IN' ? `<strong>${escapeHtml(targetRole)}</strong> இல் சொந்த தொழில் தொடங்க PM முத்ரா கடன் (ரூ. 50,000 முதல் ரூ. 5 லட்சம் வரை) பெற்றுத் தருதல்.` : l === 'kn-IN' ? `<strong>${escapeHtml(targetRole)}</strong> ನಲ್ಲಿ ಸ್ವಂತ ಉದ್ಯಮ ಸ್ಥಾಪಿಸಲು PM ಮುದ್ರಾ ಸಾಲ (₹50,000 ರಿಂದ ₹5 ಲಕ್ಷದವರೆಗೆ) ಸೌಲಭ್ಯ ಒದಗಿಸುವುದು.` : `Facilitate PMMY Mudra Loan (Shishu/Kishore up to ₹50k–₹5 Lakh) or Stand-Up India credit linkage for establishing self-sustaining unit in <strong>${escapeHtml(targetRole)}</strong>.`)
            : (l === 'te-IN' ? `<strong>${escapeHtml(targetRole)}</strong> ఉద్యోగం కోసం ప్రాంతీయ పారిశ్రామిక యజమానులు మరియు MSME సంస్థలతో ప్రత్యక్ష ఇంటర్వ్యూ లింకేజ్.` : l === 'hi-IN' ? `<strong>${escapeHtml(targetRole)}</strong> के लिए जिला औद्योगिक नियोक्ताओं और सत्यापित एमएसएमई भागीदारों के साथ सीधा साक्षात्कार।` : l === 'ta-IN' ? `<strong>${escapeHtml(targetRole)}</strong> பணிக்காக பிராந்திய தொழில் நிறுவனங்களுடன் நேரடி வேலைவாய்ப்பு நேர்காணல் ஏற்பாடு செய்தல்.` : l === 'kn-IN' ? `<strong>${escapeHtml(targetRole)}</strong> ಹುದ್ದೆಗಾಗಿ ಪ್ರಾದೇಶಿಕ ಕೈಗಾರಿಕಾ ಸಂಸ್ಥೆಗಳು ಮತ್ತು MSME ಪಾಲುದಾರರೊಂದಿಗೆ ನೇರ ಸಂದರ್ಶನ ಸಂಪರ್ಕ.` : `Direct placement interview linkage with district industrial employers and verified MSME hiring partners for <strong>${escapeHtml(targetRole)}</strong>.`);

        // Stage 6
        const s6Title = l === 'te-IN' ? 'స్థిరమైన ఆదాయ పర్యవేక్షణ & సంక్షేమ అధికారి సహాయం' : l === 'hi-IN' ? 'स्थायी आय निगरानी और जिला कल्याण अधिकारी पर्यवेक्षण' : l === 'ta-IN' ? 'நிலையான வருமான கண்காணிப்பு & நல அலுவலர் மேற்பார்வை' : l === 'kn-IN' ? 'ನಿರಂತರ ಆದಾಯ ಪರಿಶೀಲನೆ & ಕಲ್ಯಾಣಾಧಿಕಾರಿಗಳ ಮೇಲ್ವಿಚಾರಣೆ' : 'Sustainable Income Tracking & District Welfare Officer Oversight';
        const s6Desc = l === 'te-IN' ? 'ఆదాయ స్థిరత్వం మరియు నిరంతర ఎదుగుదలను నిర్ధారించడానికి జిల్లా సాంఘిక సంక్షేమ అధికారుల ద్వారా త్రైమాసిక సమీక్షలు.' : l === 'hi-IN' ? 'आय स्थिरता और ऋण अदायगी सुनिश्चित करने के लिए जिला समाज कल्याण अधिकारियों द्वारा त्रैमासिक समीक्षा।' : l === 'ta-IN' ? 'வருமான நிலைத்தன்மையை உறுதி செய்ய மாவட்ட சமூக நல அலுவலர்களின் காலாண்டு மதிப்பாய்வு மற்றும் வழிகாட்டுதல்.' : l === 'kn-IN' ? 'ಆದಾಯದ ಸ್ಥಿರತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಜಿಲ್ಲಾ ಸಮಾಜ ಕಲ್ಯಾಣಾಧಿಕಾರಿಗಳಿಂದ ತ್ರೈಮಾಸಿಕ ಪ್ರಗತಿ ಪರಿಶೀಲನೆ.' : 'Quarterly livelihood sustainability reviews by District Social Welfare Officers to ensure income stability, loan repayment compliance, and continuous upskilling.';

        container.innerHTML = `
            <!-- Overview Banner -->
            <div class="glass-card mb-20" style="background:linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border:1px solid #bfdbfe; padding:20px; border-radius:14px; margin-bottom:20px; box-shadow:0 4px 12px rgba(59,130,246,0.08);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
                    <div>
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                            <span class="badge badge-primary" style="font-size:12px;">ID: ${escapeHtml(b.id)}</span>
                            <span class="badge badge-info" style="font-size:12px;">📍 ${escapeHtml(b.region || 'District Level')}</span>
                            <span class="badge badge-success" style="font-size:12px;">${escapeHtml(b.status || 'Active')}</span>
                        </div>
                        <h3 style="font-size:19px; font-weight:800; color:#1e3a8a; margin:0;">${roadmapTitle}</h3>
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:12px; color:#1e40af; font-weight:700;">${trackLabel}</span>
                        <div style="font-size:14px; font-weight:800; color:#1d4ed8;">${escapeHtml(targetType)}</div>
                    </div>
                </div>

                <div style="margin-top:14px; padding-top:12px; border-top:1px solid #bfdbfe; display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; font-size:13px; color:#1e40af;">
                    <div>${recCourseLabel}<br><span style="color:#1e3a8a; font-weight:700;">${escapeHtml(targetProg)} (NSQF L${nsqfLvl})</span></div>
                    <div>${targetRoleLabel}<br><span style="color:#1e3a8a; font-weight:700;">${escapeHtml(targetRole)}</span></div>
                    <div>${estTimelineLabel}<br><span style="color:#1e3a8a; font-weight:700;">${escapeHtml(duration)}</span></div>
                </div>

                <div style="margin-top:12px; background:rgba(255,255,255,0.75); padding:10px 14px; border-radius:8px; font-size:12px; color:#1e3a8a;">
                    <strong>${gapsLabel}</strong>
                    <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px;">
                        ${hasGaps ? gaps.map(g => `<span class="badge" style="background:#fee2e2; color:#991b1b; font-size:11px; font-weight:600; padding:3px 8px;">⚠️ ${escapeHtml(g)}</span>`).join('') : `<span class="badge badge-success">${fullyQualifiedLabel}</span>`}
                    </div>
                </div>
            </div>
            
            <!-- 6-STEP TIMELINE -->
            <!-- Step 1 -->
            <div class="roadmap-step" style="background:#ffffff; border:1px solid #e2e8f0; border-left:5px solid #10b981; border-radius:12px; padding:16px 20px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background:#10b981; color:#fff; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800;">1</span>
                        <h4 style="color:#0f172a; font-size:15px; font-weight:700; margin:0;">${s1Title}</h4>
                    </div>
                    <span class="badge badge-success">${dict.rm_completed || '✓ Completed'}</span>
                </div>
                <p style="font-size:13px; color:#334155; margin:0 0 6px 36px; line-height:1.5;">${s1Desc}</p>
            </div>
            <div class="step-arrow" style="text-align:center; color:#94a3b8; font-size:18px; margin:4px 0;">↓</div>

            <!-- Step 2 -->
            <div class="roadmap-step" style="background:#ffffff; border:1px solid #e2e8f0; border-left:5px solid #10b981; border-radius:12px; padding:16px 20px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background:#10b981; color:#fff; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800;">2</span>
                        <h4 style="color:#0f172a; font-size:15px; font-weight:700; margin:0;">${s2Title}</h4>
                    </div>
                    <span class="badge badge-success">${dict.rm_completed || '✓ Completed'}</span>
                </div>
                <p style="font-size:13px; color:#334155; margin:0 0 6px 36px; line-height:1.5;">${s2Desc}</p>
            </div>
            <div class="step-arrow" style="text-align:center; color:#94a3b8; font-size:18px; margin:4px 0;">↓</div>

            <!-- Step 3 -->
            <div class="roadmap-step" style="background:#ffffff; border:1px solid #c7d2fe; border-left:5px solid #6366f1; border-radius:12px; padding:16px 20px; margin-bottom:12px; box-shadow:0 3px 10px rgba(99,102,241,0.08);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background:#6366f1; color:#fff; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800;">3</span>
                        <h4 style="color:#4338ca; font-size:15px; font-weight:700; margin:0;">${s3Title}</h4>
                    </div>
                    <span class="badge badge-warning">${dict.rm_next_action || '⏳ Next Action'}</span>
                </div>
                <p style="font-size:13px; color:#334155; margin:0 0 8px 36px; line-height:1.5;">${s3Desc}</p>
                <div style="margin-left:36px; display:flex; gap:10px; flex-wrap:wrap;">
                    <button class="btn btn-primary" style="font-size:12px; padding:5px 12px;" onclick="enrollBeneficiary('${escapeHtml(b.id)}')">${enrollBtnLabel}</button>
                </div>
            </div>
            <div class="step-arrow" style="text-align:center; color:#94a3b8; font-size:18px; margin:4px 0;">↓</div>

            <!-- Step 4 -->
            <div class="roadmap-step" style="background:#ffffff; border:1px solid #e2e8f0; border-left:5px solid #94a3b8; border-radius:12px; padding:16px 20px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background:#64748b; color:#fff; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800;">4</span>
                        <h4 style="color:#334155; font-size:15px; font-weight:700; margin:0;">${s4Title}</h4>
                    </div>
                    <span class="badge badge-secondary">${dict.rm_upcoming || 'Upcoming'}</span>
                </div>
                <p style="font-size:13px; color:#64748b; margin:0 0 6px 36px; line-height:1.5;">${s4Desc}</p>
            </div>
            <div class="step-arrow" style="text-align:center; color:#94a3b8; font-size:18px; margin:4px 0;">↓</div>

            <!-- Step 5 -->
            <div class="roadmap-step" style="background:#ffffff; border:1px solid #e2e8f0; border-left:5px solid #94a3b8; border-radius:12px; padding:16px 20px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background:#64748b; color:#fff; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800;">5</span>
                        <h4 style="color:#334155; font-size:15px; font-weight:700; margin:0;">${s5Title}</h4>
                    </div>
                    <span class="badge badge-secondary">${dict.rm_upcoming || 'Upcoming'}</span>
                </div>
                <p style="font-size:13px; color:#64748b; margin:0 0 6px 36px; line-height:1.5;">${s5Desc}</p>
            </div>
            <div class="step-arrow" style="text-align:center; color:#94a3b8; font-size:18px; margin:4px 0;">↓</div>

            <!-- Step 6 -->
            <div class="roadmap-step" style="background:#ffffff; border:1px solid #e2e8f0; border-left:5px solid #94a3b8; border-radius:12px; padding:16px 20px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="background:#64748b; color:#fff; width:26px; height:26px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800;">6</span>
                        <h4 style="color:#334155; font-size:15px; font-weight:700; margin:0;">${s6Title}</h4>
                    </div>
                    <span class="badge badge-secondary">${dict.rm_upcoming || 'Post-Placement'}</span>
                </div>
                <p style="font-size:13px; color:#64748b; margin:0 0 6px 36px; line-height:1.5;">${s6Desc}</p>
            </div>
        `;
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="empty-state">${dict.rm_error || 'Error loading roadmap.'}</div>`;
    }
}

async function enrollBeneficiary(id) {
    try {
        const res = await fetch('/api/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, status: 'Enrolled' })
        });
        const d = await res.json();
        if (d.success) {
            const l = currentAppLang || 'en-IN';
            const msg = l === 'te-IN' ? '✓ లబ్ధిదారుడు శిక్షణ కార్యక్రమంలో విజయవంతంగా నమోదు చేయబడ్డారు!' : l === 'hi-IN' ? '✓ लाभार्थी को प्रशिक्षण कार्यक्रम में सफलतापूर्वक नामांकित किया गया!' : l === 'ta-IN' ? '✓ பயனாளி பயிற்சி திட்டத்தில் வெற்றிகரமாக சேர்க்கப்பட்டார்!' : l === 'kn-IN' ? '✓ ಫಲಾನುಭವಿಯನ್ನು ತರಬೇತಿ ಕಾರ್ಯಕ್ರಮಕ್ಕೆ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ!' : '✓ Beneficiary successfully enrolled into training program!';
            alert(msg);
            loadBeneficiaries();
            loadPersonalRoadmap();
            loadDashboard();
        }
    } catch (e) {
        alert('Failed to update enrollment status.');
    }
}

async function loadCatalogs() {
    try {
        const res = await fetch('/api/catalogs');
        catalogData = await res.json();
        showCatalog('tp');
    } catch (err) {
        console.error(err);
    }
}

function showCatalog(type) {
    currentCatalogType = type;
    document.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(type === 'tp' ? 'subtab-tp-btn' : 'subtab-opp-btn') || document.querySelector(`.subtab-btn[onclick*="${type}"]`);
    if (btn) btn.classList.add('active');

    filterCatalog();
}

function filterCatalog() {
    const thead = document.getElementById('catalog-thead');
    const tbody = document.getElementById('catalog-tbody');
    const badge = document.getElementById('catalog-count-badge');
    const searchInput = document.getElementById('catalog-search-input');
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const l = currentAppLang || 'en-IN';
    const dict = I18N[l] || I18N['en-IN'];

    if (currentCatalogType === 'tp') {
        const list = (catalogData.trainingPrograms || []).map(p => typeof getLocalizedProgram === 'function' ? getLocalizedProgram(p, l) : p).filter(p => {
            if (!query) return true;
            const str = `${p.id || p.trainingId} ${p.name || p.programName} ${p.nsqfLevel} ${p.region} ${p.type || p.employmentType} ${p.duration} ${p.skills || p.skillsKeywords} ${p.description || ''}`.toLowerCase();
            return str.includes(query);
        });

        const countSuffix = l === 'te-IN' ? 'కార్యక్రమాలు (మొత్తం 25)' : l === 'hi-IN' ? 'कार्यक्रम (कुल 25)' : l === 'ta-IN' ? 'திட்டங்கள் (மொத்தம் 25)' : l === 'kn-IN' ? 'ಕಾರ್ಯಕ್ರಮಗಳು (ಒಟ್ಟು 25)' : 'Programs (25 Total in DB)';
        if (badge) badge.textContent = `${list.length} ${countSuffix}`;

        thead.innerHTML = `
            <tr>
                <th style="width:90px;">${dict.th_id || 'ID'}</th>
                <th>${dict.th_prog_name || 'Program Name'}</th>
                <th style="width:110px;">${dict.th_nsqf_level || 'NSQF Level'}</th>
                <th style="width:130px;">${dict.th_region || 'Region'}</th>
                <th style="width:140px;">${dict.th_emp_type || 'Employment Type'}</th>
                <th style="width:100px;">${dict.th_duration || 'Duration'}</th>
                <th>${dict.th_keywords || 'Competencies & Keywords'}</th>
            </tr>
        `;

        if (list.length === 0) {
            const noMatchMsg = l === 'te-IN' ? `"${escapeHtml(query)}" కోసం సరిపోయే శిక్షణా కార్యక్రమాలు కనుగొనబడలేదు` : l === 'hi-IN' ? `"${escapeHtml(query)}" के लिए कोई मेल खाता प्रशिक्षण कार्यक्रम नहीं मिला` : l === 'ta-IN' ? `"${escapeHtml(query)}" உடன் பொருந்தும் பயிற்சித் திட்டங்கள் எதுவும் இல்லை` : l === 'kn-IN' ? `"${escapeHtml(query)}" ಗಾಗಿ ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ತರಬೇತಿ ಕಾರ್ಯಕ್ರಮಗಳು ಕಂಡುಬಂದಿಲ್ಲ` : `No matching training programs found for "${escapeHtml(query)}"`;
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">${noMatchMsg}</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(p => {
            const empType = p.type || p.employmentType || '';
            const isSelf = empType.includes('Self') || empType.includes('స్వయం') || empType.includes('स्व');
            return `
            <tr>
                <td><strong style="color:var(--primary);">${p.id || p.trainingId}</strong></td>
                <td>
                    <div style="font-weight:700; color:var(--text-main);">${escapeHtml(p.name || p.programName)}</div>
                    <div style="font-size:11px; color:#64748b; margin-top:2px;">${escapeHtml(p.description || '')}</div>
                </td>
                <td><span class="badge badge-info" style="font-weight:700;">Level ${p.nsqfLevel}</span></td>
                <td><span class="badge" style="background:#f1f5f9; color:#475569;">${escapeHtml(p.region)}</span></td>
                <td><span class="badge ${isSelf ? 'badge-primary' : 'badge-success'}">${escapeHtml(empType)}</span></td>
                <td>${escapeHtml(p.duration)}</td>
                <td><small style="color:#334155; line-height:1.4; display:block;">${escapeHtml(p.skills || p.skillsKeywords)}</small></td>
            </tr>
            `;
        }).join('');
    } else {
        const list = (catalogData.opportunities || []).map(o => typeof getLocalizedOpportunity === 'function' ? getLocalizedOpportunity(o, l) : o).filter(o => {
            if (!query) return true;
            const str = `${o.id || o.opportunityId} ${o.name || o.opportunityName} ${o.type} ${o.requiredSkill} ${o.region} ${o.description || ''}`.toLowerCase();
            return str.includes(query);
        });

        const countSuffix = l === 'te-IN' ? 'అవకాశాలు (మొత్తం 25)' : l === 'hi-IN' ? 'अवसर (कुल 25)' : l === 'ta-IN' ? 'வாய்ப்புகள் (மொத்தம் 25)' : l === 'kn-IN' ? 'ಅವಕಾಶಗಳು (ಒಟ್ಟು 25)' : 'Opportunities (25 Total in DB)';
        if (badge) badge.textContent = `${list.length} ${countSuffix}`;

        thead.innerHTML = `
            <tr>
                <th style="width:90px;">${dict.th_id || 'ID'}</th>
                <th>${dict.th_opp_name || 'Opportunity Name'}</th>
                <th style="width:180px;">${dict.th_type || 'Opportunity Track'}</th>
                <th>${dict.th_req_skill || 'Required Competencies'}</th>
                <th style="width:130px;">${dict.th_region || 'Region'}</th>
                <th>${dict.th_desc || 'Description & Linkage'}</th>
            </tr>
        `;

        if (list.length === 0) {
            const noMatchMsg = l === 'te-IN' ? `"${escapeHtml(query)}" కోసం సరిపోయే ఉద్యోగ అవకాశాలు కనుగొనబడలేదు` : l === 'hi-IN' ? `"${escapeHtml(query)}" के लिए कोई मेल खाता रोजगार अवसर नहीं मिला` : l === 'ta-IN' ? `"${escapeHtml(query)}" உடன் பொருந்தும் வேலைவாய்ப்புகள் எதுவும் இல்லை` : l === 'kn-IN' ? `"${escapeHtml(query)}" ಗಾಗಿ ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ಉದ್ಯೋಗಾವಕಾಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ` : `No matching livelihood opportunities found for "${escapeHtml(query)}"`;
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:#94a3b8;">${noMatchMsg}</td></tr>`;
            return;
        }

        tbody.innerHTML = list.map(o => {
            const isSelf = o.type && (o.type.includes('Self') || o.type.includes('స్వయం') || o.type.includes('स्व'));
            return `
            <tr>
                <td><strong style="color:var(--secondary);">${o.id || o.opportunityId}</strong></td>
                <td><strong style="color:var(--text-main); font-size:13px;">${escapeHtml(o.name || o.opportunityName)}</strong></td>
                <td><span class="badge ${isSelf ? 'badge-primary' : 'badge-success'}">${escapeHtml(o.type)}</span></td>
                <td><span style="color:#0f172a; font-weight:600; font-size:12px;">${escapeHtml(o.requiredSkill)}</span></td>
                <td><span class="badge" style="background:#f1f5f9; color:#475569;">${escapeHtml(o.region)}</span></td>
                <td><small style="color:#475569; line-height:1.4; display:block;">${escapeHtml(o.description)}</small></td>
            </tr>
            `;
        }).join('');
    }
}

// =============================================================================
// 7. AI VOICE HUB & CHAT ASSISTANT
// =============================================================================
function formatChatTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function toggleChatVoice() {
    chatVoiceEnabled = !chatVoiceEnabled;
    const btn = document.getElementById('chat-voice-toggle');
    btn.textContent = chatVoiceEnabled ? '🔊 Voice On' : '🔇 Voice Off';
    btn.style.opacity = chatVoiceEnabled ? '1' : '0.5';
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    appendChatBubble('user', msg);
    input.value = '';

    const benId = document.getElementById('chat-ben-select')?.value || '';
    const sendBtn = document.getElementById('chat-send-btn');
    sendBtn.disabled = true;
    sendBtn.textContent = '...';

    try {
        // Calls Java backend — uses rule-based AiEngine (no API key, no login, 100% local)
        const res = await fetch('/api/ai-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, beneficiaryId: benId })
        });
        const data = await res.json();
        if (data.success) {
            appendChatBubble('ai', data.reply);
            speakText(data.reply, currentAppLang);
        } else {
            appendChatBubble('ai', '⚠️ ' + (data.error || 'Could not process that. Please try again.'));
        }
    } catch (err) {
        appendChatBubble('ai', '⚠️ Connection error with Saathi server.');
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
    }
}

function appendChatBubble(role, text) {
    const win = document.getElementById('chat-window');
    if (!win) return;
    const div = document.createElement('div');
    div.className = `chat-msg chat-msg-${role}`;
    const formatted = text.replace(/\n/g, '<br>');
    div.innerHTML = role === 'ai'
        ? `<div class="chat-avatar">🤖</div><div class="chat-bubble"><p>${formatted}</p><span class="chat-time">${formatChatTime()}</span></div>`
        : `<div class="chat-bubble user-bubble"><p>${escapeHtml(text)}</p><span class="chat-time">${formatChatTime()}</span></div><div class="chat-avatar user-avatar">👤</div>`;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
}

function startVoiceMessage() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');

    const recognition = new SR();
    recognition.lang = currentAppLang || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const status = document.getElementById('voice-msg-status');
    const micBtn = document.getElementById('chat-mic-btn');
    if (status) status.textContent = '🎙 Listening...';
    if (micBtn) micBtn.classList.add('mic-active');

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        const chatInput = document.getElementById('chat-input');
        if (chatInput) chatInput.value = transcript;
        await sendChatMessage();
        if (status) status.textContent = '';
    };

    recognition.onerror = () => {
        if (status) status.textContent = '❌ Speech recognition error.';
        if (micBtn) micBtn.classList.remove('mic-active');
    };

    recognition.onend = () => {
        if (micBtn) micBtn.classList.remove('mic-active');
    };

    recognition.start();
}

function simulateVoiceInput() {
    document.getElementById('reg-name').value = 'Ramesh Kumar';
    document.getElementById('reg-phone').value = '9876543210';
    document.getElementById('reg-lang').value = 'Telugu';
    document.getElementById('reg-edu').value = '10th Pass';
    document.getElementById('reg-famocc').value = 'Handloom Weaving';
    document.getElementById('reg-curliv').value = 'Daily Wage Worker';
    document.getElementById('reg-skills').value = 'Basic Sewing, Handloom Operation';
    document.getElementById('reg-interests').value = 'Garment Making, Tailoring';
    document.getElementById('reg-aspirations').value = 'Start Local Tailoring Shop';
    document.getElementById('reg-constraints').value = 'Local District Salem / Tirupati';
    document.getElementById('reg-emppref').value = 'Self Employment';
    document.getElementById('reg-region').value = 'Rural Salem';
    alert('🎤 Voice Simulation: Auto-populated sample beneficiary data into form!');
}

// =============================================================================
// 8. STATUS UPDATE MODAL & UTILITIES
// =============================================================================
function openStatusModal(benId) {
    const ben = allBeneficiaries.find(b => b.id === benId);
    if (!ben) return;

    document.getElementById('modal-ben-id').value = ben.id;
    document.getElementById('modal-ben-name').textContent = `Update Status for ${ben.name} (${ben.id})`;
    document.getElementById('modal-status-select').value = ben.status;
    document.getElementById('status-modal').classList.add('active');
}

function closeStatusModal() {
    document.getElementById('status-modal').classList.remove('active');
}

async function submitStatusUpdate() {
    const benId = document.getElementById('modal-ben-id').value;
    const newStatus = document.getElementById('modal-status-select').value;

    try {
        const res = await fetch('/api/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ beneficiaryId: benId, status: newStatus })
        });
        const data = await res.json();

        if (data.success) {
            closeStatusModal();
            loadDashboard();
            loadBeneficiaries();
        } else {
            alert('Error updating status: ' + data.error);
        }
    } catch (err) {
        alert('Failed to connect to server.');
    }
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'Profile Created': return 'badge-secondary';
        case 'Recommendation Generated': return 'badge-primary';
        case 'Enrolled':
        case 'Training In Progress': return 'badge-warning';
        case 'Training Completed': return 'badge-info';
        case 'Placed':
        case 'Self-Employment Started': return 'badge-success';
        case 'Needs Officer Support': return 'badge-danger';
        default: return 'badge-secondary';
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
