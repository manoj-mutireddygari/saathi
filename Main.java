import java.io.*;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.util.*;

/**
 * ============================================================================
 * Saathi – Multilingual Voice Livelihood Assistant
 * Prototype for Smart India Hackathon (SIH)
 *
 * Single-file implementation containing all data models, recommendation engines,
 * skill gap analysis, personalized roadmap generator, officer dashboard, and storage.
 * ============================================================================
 */
public class Main {

    // Global in-memory data repositories
    private static final List<Beneficiary> beneficiaries = new ArrayList<>();
    private static final List<TrainingProgram> trainingPrograms = new ArrayList<>();
    private static final List<Opportunity> opportunities = new ArrayList<>();

    // ID Generator counter — volatile for thread-safe access across onboarding handler threads
    private static volatile int nextBeneficiaryId = 1001;

    // In-memory onboarding session store (sessionId → session)
    static final java.util.concurrent.ConcurrentHashMap<String, BeneficiaryOnboardingSession>
        onboardingSessions = new java.util.concurrent.ConcurrentHashMap<>();

    // Database URL for SQLite persistence
    private static final String DB_URL = "jdbc:sqlite:saathi.db";

    // Database Connection & Initialization Helper
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL);
    }

    public static List<Beneficiary> getBeneficiaries() { return beneficiaries; }
    public static List<TrainingProgram> getTrainingPrograms() { return trainingPrograms; }
    public static List<Opportunity> getOpportunities() { return opportunities; }

    public static String registerBeneficiaryDirect(String name, String phone, String language, String education,
                                                  String familyOccupation, String currentLivelihood, String skills,
                                                  String interests, String aspirations, String constraints,
                                                  String employmentPreference, String region) {
        String idStr = String.valueOf(nextBeneficiaryId++);
        String regDate = new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());

        Beneficiary beneficiary = new Beneficiary(
                idStr, name, phone, language, education, familyOccupation,
                currentLivelihood, skills, interests, aspirations, constraints,
                employmentPreference, region, "Profile Created", regDate
        );

        beneficiaries.add(beneficiary);
        saveBeneficiaryToDb(beneficiary);
        return idStr;
    }

    public static void initDatabase() {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            // Table for Beneficiaries
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS beneficiaries (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    phone TEXT,
                    language TEXT,
                    education TEXT,
                    family_occupation TEXT,
                    current_livelihood TEXT,
                    skills TEXT,
                    interests TEXT,
                    aspirations TEXT,
                    constraints TEXT,
                    employment_preference TEXT,
                    region TEXT,
                    status TEXT,
                    registration_date TEXT
                );
            """);

            // Table for Training Programs
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS training_programs (
                    training_id TEXT PRIMARY KEY,
                    program_name TEXT NOT NULL,
                    nsqf_level INTEGER,
                    region TEXT,
                    employment_type TEXT,
                    skills_keywords TEXT,
                    duration TEXT,
                    description TEXT
                );
            """);

            // Table for Opportunities
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS opportunities (
                    opportunity_id TEXT PRIMARY KEY,
                    opportunity_name TEXT NOT NULL,
                    region TEXT,
                    type TEXT,
                    required_skill TEXT,
                    description TEXT
                );
            """);

            // Table for Onboarding Sessions (conversational intake log)
            stmt.execute("""
                CREATE TABLE IF NOT EXISTS onboarding_sessions (
                    session_id       TEXT PRIMARY KEY,
                    mode             TEXT,
                    language         TEXT,
                    current_step     INTEGER,
                    collected_json   TEXT,
                    status           TEXT,
                    beneficiary_id   TEXT,
                    created_at       TEXT,
                    updated_at       TEXT
                );
            """);

            System.out.println("[✓] SQLite Database 'saathi.db' initialized successfully.");
        } catch (SQLException e) {
            System.err.println("[X] SQLite Database initialization error: " + e.getMessage());
        }
    }

    // ========================================================================
    // MAIN ENTRY POINT & CONSOLE MENU LOOP
    // ========================================================================
    public static void main(String[] args) {
        // Initialize SQLite database schema
        initDatabase();

        // Load sample training programmes & local opportunities from DB
        loadSampleData();

        // Load previously saved beneficiary data from SQLite
        loadData();

        if (args.length > 0 && args[0].equalsIgnoreCase("--cli")) {
            runConsoleMenu();
        } else {
            WebServer.main(args);
        }
    }

    private static void runConsoleMenu() {
        try (Scanner scanner = new Scanner(System.in)) {
            boolean running = true;
            while (running) {
                printMainMenu();
                System.out.print("Enter your choice (1-12): ");
                String input = scanner.nextLine().trim();

                int choice;
                try {
                    choice = Integer.parseInt(input);
                } catch (NumberFormatException e) {
                    System.out.println("\n[X] Invalid input! Please enter a valid number between 1 and 12.\n");
                    continue;
                }

                switch (choice) {
                    case 1 -> registerBeneficiary(scanner);
                    case 2 -> viewBeneficiaryProfile(scanner);
                    case 3 -> generateTrainingRecommendations(scanner);
                    case 4 -> generateJobRecommendations(scanner);
                    case 5 -> viewPersonalizedRoadmap(scanner);
                    case 6 -> updateTrainingPlacementStatus(scanner);
                    case 7 -> officerDashboard(scanner);
                    case 8 -> viewTrainingPrograms();
                    case 9 -> viewLocalOpportunities();
                    case 10 -> searchBeneficiary(scanner);
                    case 11 -> saveData();
                    case 12 -> {
                        System.out.println("\nSaving data before exit...");
                        saveData();
                        System.out.println("Thank you for using Saathi! Empowering SC Beneficiaries nationwide.\n");
                        running = false;
                    }
                    default -> System.out.println("\n[X] Invalid choice! Please select an option from 1 to 12.\n");
                }
            }
        }
    }

    private static void printMainMenu() {
        System.out.println("=================================================");
        System.out.println("                   Saathi                     ");
        System.out.println("   AI-Powered Multilingual Livelihood Assistant  ");
        System.out.println("=================================================");
        System.out.println(" 1. Register Beneficiary (Conversational Flow)");
        System.out.println(" 2. View Beneficiary Profile");
        System.out.println(" 3. Generate AI Training Recommendations");
        System.out.println(" 4. Generate Job/Livelihood Recommendations");
        System.out.println(" 5. View Personalized Livelihood Roadmap");
        System.out.println(" 6. Update Training/Placement Status");
        System.out.println(" 7. Officer Dashboard (Monitoring & Pipeline)");
        System.out.println(" 8. View Training Programmes (NSQF Aligned)");
        System.out.println(" 9. View Local Opportunities");
        System.out.println("10. Search Beneficiary");
        System.out.println("11. Save Data");
        System.out.println("12. Exit");
        System.out.println("=================================================");
    }

    // ========================================================================
    // 1. BENEFICIARY REGISTRATION (Conversational Profiling)
    // ========================================================================
    private static void registerBeneficiary(Scanner scanner) {
        System.out.println("\n-------------------------------------------------");
        System.out.println("         BENEFICIARY REGISTRATION PROFILING      ");
        System.out.println("-------------------------------------------------");

        /*
         * MULTILINGUAL & VOICE SIMULATION NOTE:
         * In full production, this module connects to ASR (Speech-to-Text),
         * IVR phone systems, and WhatsApp voice notes in regional dialects.
         */
        System.out.println("Select Interaction Language:");
        System.out.println("1. English");
        System.out.println("2. Hindi (हिंदी)");
        System.out.println("3. Tamil (தமிழ்)");
        System.out.println("4. Telugu (తెలుగు)");
        System.out.print("Choice (1-4, default=1): ");
        String langChoice = scanner.nextLine().trim();

        String selectedLang = switch (langChoice) {
            case "2" -> "Hindi";
            case "3" -> "Tamil";
            case "4" -> "Telugu";
            default -> "English";
        };

        System.out.println("\n[Saathi Voice Simulation]: Hello! Saathi is ready to assist you in " + selectedLang + ".");
        System.out.println("Please provide your details below (Voice-to-Text simulation):\n");

        String name = promptNonEmpty(scanner, "Enter Name: ");
        String phone = promptNonEmpty(scanner, "Enter Phone Number: ");

        System.out.print("Enter Education Level (e.g., 10th Pass, 12th Pass, Graduate, ITI, None): ");
        String education = scanner.nextLine().trim();
        if (education.isEmpty()) education = "Not Specified";

        System.out.print("Enter Family/Traditional Occupation (e.g., Agriculture, Weaving, Leatherwork, Artisan): ");
        String familyOccupation = scanner.nextLine().trim();
        if (familyOccupation.isEmpty()) familyOccupation = "None";

        System.out.print("Enter Current Livelihood/Occupation (e.g., Daily Wager, Tailor Assistant, Unemployed): ");
        String currentLivelihood = scanner.nextLine().trim();
        if (currentLivelihood.isEmpty()) currentLivelihood = "Unemployed";

        System.out.print("Enter Existing Skills (comma-separated, e.g., Basic Computer, Sewing, Wiring): ");
        String skills = scanner.nextLine().trim();
        if (skills.isEmpty()) skills = "Basic Communication";

        System.out.print("Enter Interests (comma-separated, e.g., Electronics, Fashion, Data Entry, Business): ");
        String interests = scanner.nextLine().trim();
        if (interests.isEmpty()) interests = "General Employment";

        System.out.print("Enter Future Aspirations (e.g., Start Small Business, Computer Operator, Technician): ");
        String aspirations = scanner.nextLine().trim();
        if (aspirations.isEmpty()) aspirations = "Gainful Livelihood";

        System.out.print("Enter Mobility/Physical Constraints (e.g., Local only, Night shift restriction, None): ");
        String constraints = scanner.nextLine().trim();
        if (constraints.isEmpty()) constraints = "None";

        System.out.println("Select Employment Preference:");
        System.out.println("1. Wage Employment");
        System.out.println("2. Self Employment");
        System.out.println("3. Both");
        System.out.print("Choice (1-3): ");
        String prefChoice = scanner.nextLine().trim();
        String empPref = "Both";
        if (prefChoice.equals("1")) empPref = "Wage Employment";
        else if (prefChoice.equals("2")) empPref = "Self Employment";

        System.out.print("Enter Region / District (e.g., Rural - Salem, Urban - Delhi, Patna): ");
        String region = scanner.nextLine().trim();
        if (region.isEmpty()) region = "District Level";

        // Auto Generate Beneficiary ID
        String idStr = String.valueOf(nextBeneficiaryId++);
        String regDate = new SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());

        Beneficiary beneficiary = new Beneficiary(
                idStr, name, phone, selectedLang, education, familyOccupation,
                currentLivelihood, skills, interests, aspirations, constraints,
                empPref, region, "Profile Created", regDate
        );

        beneficiaries.add(beneficiary);
        saveBeneficiaryToDb(beneficiary);

        System.out.println("\n-------------------------------------------------");
        System.out.println("✓ Beneficiary registered successfully!");
        System.out.println("✓ Beneficiary ID: " + idStr);
        System.out.println("✓ Status: Profile Created");
        System.out.println("-------------------------------------------------\n");
    }

    private static String promptNonEmpty(Scanner scanner, String prompt) {
        String input = "";
        while (input.isEmpty()) {
            System.out.print(prompt);
            input = scanner.nextLine().trim();
            if (input.isEmpty()) {
                System.out.println("[X] This field cannot be empty. Please enter a value.");
            }
        }
        return input;
    }

    // Helper method to find a beneficiary by ID
    public static Beneficiary findBeneficiaryById(String id) {
        if (id == null || id.trim().isEmpty()) return null;
        for (Beneficiary b : beneficiaries) {
            if (b.getId().equalsIgnoreCase(id.trim())) {
                return b;
            }
        }
        return null;
    }

    // ========================================================================
    // 2. VIEW BENEFICIARY PROFILE
    // ========================================================================
    private static void viewBeneficiaryProfile(Scanner scanner) {
        System.out.println("\n-------------------------------------------------");
        System.out.println("             VIEW BENEFICIARY PROFILE            ");
        System.out.println("-------------------------------------------------");
        System.out.print("Enter Beneficiary ID: ");
        String id = scanner.nextLine().trim();

        Beneficiary b = findBeneficiaryById(id);
        if (b == null) {
            System.out.println("[X] Beneficiary with ID '" + id + "' not found.\n");
            return;
        }

        printBeneficiaryProfileDetails(b);
    }

    private static void printBeneficiaryProfileDetails(Beneficiary b) {
        System.out.println("\n=================================================");
        System.out.println("BENEFICIARY PROFILE: " + b.getName() + " (ID: " + b.getId() + ")");
        System.out.println("=================================================");
        System.out.println("Phone Number           : " + b.getPhone());
        System.out.println("Preferred Language     : " + b.getLanguage());
        System.out.println("Education Level        : " + b.getEducation());
        System.out.println("Family Occupation      : " + b.getFamilyOccupation());
        System.out.println("Current Livelihood     : " + b.getCurrentLivelihood());
        System.out.println("Existing Skills        : " + b.getSkills());
        System.out.println("Interests              : " + b.getInterests());
        System.out.println("Future Aspirations     : " + b.getAspirations());
        System.out.println("Mobility Constraints   : " + b.getConstraints());
        System.out.println("Employment Preference  : " + b.getEmploymentPreference());
        System.out.println("Region / District      : " + b.getRegion());
        System.out.println("Pipeline Status        : " + b.getStatus());
        System.out.println("Registration Date      : " + b.getRegistrationDate());
        System.out.println("=================================================\n");
    }

    // ========================================================================
    // 3. GENERATE AI TRAINING RECOMMENDATIONS
    // ========================================================================
    private static void generateTrainingRecommendations(Scanner scanner) {
        System.out.println("\n-------------------------------------------------");
        System.out.println("     AI-POWERED NSQF TRAINING RECOMMENDATIONS   ");
        System.out.println("-------------------------------------------------");
        System.out.print("Enter Beneficiary ID: ");
        String id = scanner.nextLine().trim();

        Beneficiary b = findBeneficiaryById(id);
        if (b == null) {
            System.out.println("[X] Beneficiary with ID '" + id + "' not found.\n");
            return;
        }

        List<Recommendation<TrainingProgram>> recommendations = calculateTrainingRecommendations(b);

        System.out.println("\n=================================================");
        System.out.println("TOP TRAINING RECOMMENDATIONS FOR: " + b.getName());
        System.out.println("=================================================");

        int rank = 1;
        for (Recommendation<TrainingProgram> rec : recommendations) {
            TrainingProgram tp = rec.getItem();
            System.out.println("\n" + rank + ". " + tp.getProgramName() + " (NSQF Level " + tp.getNsqfLevel() + ")");
            System.out.println("   Match Score: " + rec.getScore() + "%");
            System.out.println("   Duration   : " + tp.getDuration() + " | Type: " + tp.getEmploymentType());
            System.out.println("   Description: " + tp.getDescription());
            System.out.println("   Why Recommended:");
            for (String reason : rec.getReasons()) {
                System.out.println("     • " + reason);
            }
            rank++;
        }
        System.out.println("=================================================\n");

        if (b.getStatus().equalsIgnoreCase("Profile Created")) {
            b.setStatus("Recommendation Generated");
            saveBeneficiaryToDb(b);
            System.out.println("[+] Beneficiary status updated to: 'Recommendation Generated'\n");
        }
    }

    // ========================================================================
    // CONCEPT CLUSTERS FOR HIGH-PRECISION SEMANTIC RECOMMENDATION MATCHING
    // ========================================================================
    private static final Map<String, List<String>> CONCEPT_CLUSTERS = new HashMap<>();
    static {
        CONCEPT_CLUSTERS.put("digital", Arrays.asList("computer", "typing", "data entry", "office", "it", "software", "excel", "spreadsheet", "digital", "annotation", "coding", "web", "python", "cyber", "ai", "hardware", "internet", "tech", "laptop", "pc"));
        CONCEPT_CLUSTERS.put("textile", Arrays.asList("tailor", "stitching", "sewing", "garment", "fashion", "apparel", "boutique", "textile", "embroidery", "handloom", "dressmaking", "cloth", "weaving", "pattern"));
        CONCEPT_CLUSTERS.put("electrical", Arrays.asList("electrical", "wiring", "electrician", "solar", "panel", "inverter", "appliance", "lighting", "motor", "repair", "ac", "refrigerator", "maintenance", "hvac", "cooling", "cctv", "surveillance", "installation"));
        CONCEPT_CLUSTERS.put("electronics", Arrays.asList("electronics", "mobile", "phone", "smartphone", "hardware", "cctv", "surveillance", "security", "iot", "gadget", "chip", "soldering", "screen", "repair"));
        CONCEPT_CLUSTERS.put("automotive", Arrays.asList("automotive", "vehicle", "car", "bike", "scooter", "ev", "electric vehicle", "driving", "driver", "mechanic", "fleet", "transport", "logistics", "heavy"));
        CONCEPT_CLUSTERS.put("healthcare", Arrays.asList("health", "healthcare", "nursing", "hospital", "patient", "care", "gda", "medical", "phlebotomy", "ayush", "ayurveda", "yoga", "wellness", "elderly", "first aid", "clinic"));
        CONCEPT_CLUSTERS.put("agriculture", Arrays.asList("farming", "agriculture", "crop", "soil", "organic", "fertilizer", "dairy", "cow", "buffalo", "milk", "poultry", "irrigation", "drone", "agritech", "farm", "produce", "cattle", "husbandry", "bio"));
        CONCEPT_CLUSTERS.put("food", Arrays.asList("food", "cooking", "catering", "chef", "bakery", "confectionery", "preserves", "pickle", "fssai", "snacks", "kitchen", "hospitality", "culinary", "restaurant", "recipe"));
        CONCEPT_CLUSTERS.put("beauty", Arrays.asList("beauty", "cosmetology", "hair", "salon", "spa", "makeup", "skincare", "parlour", "bridal", "grooming"));
        CONCEPT_CLUSTERS.put("plumbing", Arrays.asList("plumbing", "pipe", "water", "sanitary", "purification", "drainage", "plumber", "pump", "ro", "fitting"));
        CONCEPT_CLUSTERS.put("craft", Arrays.asList("artisan", "handicraft", "wood", "carpentry", "pottery", "carving", "craft", "jute", "bamboo", "weaving", "handloom", "clay"));
        CONCEPT_CLUSTERS.put("finance", Arrays.asList("finance", "banking", "accounting", "tally", "gst", "loan", "insurance", "microfinance", "cashier", "sales", "retail", "store", "agent", "bank mitra", "pos"));
        CONCEPT_CLUSTERS.put("industrial", Arrays.asList("cnc", "lathe", "milling", "machinist", "manufacturing", "tooling", "factory", "precision", "operator"));
    }

    private static double calculateSemanticSimilarity(String textA, String textB) {
        if (textA == null || textB == null || textA.isEmpty() || textB.isEmpty()) return 0.0;
        String a = textA.toLowerCase();
        String b = textB.toLowerCase();

        // 1. Direct substring overlap
        String[] tokensA = a.split("[,\\s/]+");
        int directHits = 0;
        for (String t : tokensA) {
            if (t.length() > 2 && b.contains(t)) {
                directHits++;
            }
        }
        if (directHits > 0) {
            return Math.min(1.0, 0.45 + directHits * 0.25);
        }

        // 2. Concept cluster ontology match
        for (Map.Entry<String, List<String>> entry : CONCEPT_CLUSTERS.entrySet()) {
            boolean aInCluster = entry.getValue().stream().anyMatch(a::contains);
            boolean bInCluster = entry.getValue().stream().anyMatch(b::contains);
            if (aInCluster && bInCluster) {
                return 0.75;
            }
        }
        return 0.0;
    }

    public static List<Recommendation<TrainingProgram>> calculateTrainingRecommendations(Beneficiary b) {
        List<Recommendation<TrainingProgram>> list = new ArrayList<>();
        String bSkills = b.getSkills() == null ? "" : b.getSkills();
        String bInterests = b.getInterests() == null ? "" : b.getInterests();
        String bAspirations = b.getAspirations() == null ? "" : b.getAspirations();
        String bRegion = b.getRegion() == null ? "All" : b.getRegion();
        String bEmpPref = b.getEmploymentPreference() == null ? "Both" : b.getEmploymentPreference();
        String bEducation = b.getEducation() == null ? "10th Standard Pass" : b.getEducation();
        String bFamOcc = b.getFamilyOccupation() == null ? "" : b.getFamilyOccupation();
        String bCurLiv = b.getCurrentLivelihood() == null ? "" : b.getCurrentLivelihood();

        for (TrainingProgram tp : trainingPrograms) {
            double skillSim = calculateSemanticSimilarity(bSkills, tp.getSkillsKeywords() + " " + tp.getProgramName());
            double interestSim = calculateSemanticSimilarity(bInterests, tp.getSkillsKeywords() + " " + tp.getProgramName() + " " + tp.getDescription());
            double aspirationSim = calculateSemanticSimilarity(bAspirations, tp.getProgramName() + " " + tp.getDescription());
            double familySim = calculateSemanticSimilarity(bFamOcc + " " + bCurLiv, tp.getDescription() + " " + tp.getSkillsKeywords());

            int score = 0;
            List<String> reasons = new ArrayList<>();

            // 1. Skill Match (Up to 30 pts)
            if (skillSim > 0.4) {
                int pts = (int)(skillSim * 30);
                score += pts;
                reasons.add(String.format("Core Competency Match (%d%%): Aligns with your current skills in %s.", (int)(skillSim * 100), bSkills));
            }

            // 2. Interest Alignment (Up to 25 pts)
            if (interestSim > 0.4) {
                int pts = (int)(interestSim * 25);
                score += pts;
                reasons.add(String.format("High Interest Synergies (%d%%): Directly matches your stated passion for %s.", (int)(interestSim * 100), bInterests));
            }

            // 3. Career Aspiration Fit (Up to 20 pts)
            if (aspirationSim > 0.4) {
                int pts = (int)(aspirationSim * 20);
                score += pts;
                reasons.add(String.format("Long-term Career Pathway (%d%%): Supports your career goal of '%s'.", (int)(aspirationSim * 100), bAspirations));
            }

            // 4. NSQF Level & Educational Prerequisite Fit (Up to 10 pts)
            int eduFit = 10;
            if (tp.getNsqfLevel() <= 3) {
                eduFit = 10; // accessible to all
                reasons.add(String.format("NSQF Level %d Qualification: Foundation entry with 100%% practical hands-on labs.", tp.getNsqfLevel()));
            } else if (tp.getNsqfLevel() == 4) {
                if (bEducation.toLowerCase().contains("10th") || bEducation.toLowerCase().contains("12th") || bEducation.toLowerCase().contains("graduate") || skillSim > 0.5) {
                    eduFit = 10;
                } else {
                    eduFit = 7;
                }
                reasons.add(String.format("NSQF Level %d Certified: Accredited curriculum aligned with National Occupational Standards (NOS).", tp.getNsqfLevel()));
            } else {
                eduFit = (bEducation.toLowerCase().contains("12th") || bEducation.toLowerCase().contains("graduate")) ? 10 : 6;
                reasons.add(String.format("Advanced NSQF Level %d: High-demand technical supervisory specialization.", tp.getNsqfLevel()));
            }
            score += eduFit;

            // 5. Regional Viability & Mobility (Up to 10 pts)
            if (tp.getRegion().equalsIgnoreCase("All") || tp.getRegion().toLowerCase().contains(bRegion.toLowerCase()) || bRegion.toLowerCase().contains(tp.getRegion().toLowerCase())) {
                score += 10;
                reasons.add(String.format("High Regional Demand: Active placement clusters and training centers in %s.", bRegion));
            } else {
                score += 4;
            }

            // 6. Employment Preference Fit (Up to 5 pts)
            if (bEmpPref.equalsIgnoreCase("Both") || bEmpPref.equalsIgnoreCase(tp.getEmploymentType()) || tp.getEmploymentType().equalsIgnoreCase("Both")) {
                score += 5;
                reasons.add(String.format("Preferred Work Mode: Optimized for %s.", tp.getEmploymentType()));
            }

            // 7. Traditional / Family Background Boost
            if (familySim > 0.4) {
                score += 5;
                reasons.add(String.format("Intergenerational Synergy: Builds upon family livelihood background in %s.", bFamOcc));
            }

            // Economic viability reason
            if (score >= 65) {
                String incomeRange = tp.getNsqfLevel() >= 4 ? "₹18,000 – ₹28,000/month" : "₹14,000 – ₹22,000/month";
                reasons.add(String.format("Income Potential: Expected monthly entry earnings of %s.", incomeRange));
                reasons.add("Government Linkage: 100% tuition subsidy & toolkit grant eligible under PM-DAKSH / PMKVY.");
            } else {
                reasons.add("Foundation Skilling: Structured modular training with guaranteed NSDC assessment.");
            }

            score = Math.max(38, Math.min(99, score));
            list.add(new Recommendation<>(tp, score, reasons));
        }

        // Sort descending by score
        list.sort((r1, r2) -> Integer.compare(r2.getScore(), r1.getScore()));
        return list;
    }

    // ========================================================================
    // 4. GENERATE JOB / LIVELIHOOD RECOMMENDATIONS
    // ========================================================================
    private static void generateJobRecommendations(Scanner scanner) {
        System.out.println("\n-------------------------------------------------");
        System.out.println("   AI LOCAL JOB / LIVELIHOOD RECOMMENDATIONS    ");
        System.out.println("-------------------------------------------------");
        System.out.print("Enter Beneficiary ID: ");
        String id = scanner.nextLine().trim();

        Beneficiary b = findBeneficiaryById(id);
        if (b == null) {
            System.out.println("[X] Beneficiary with ID '" + id + "' not found.\n");
            return;
        }

        List<Recommendation<Opportunity>> recommendations = calculateOpportunityRecommendations(b);

        System.out.println("\n=================================================");
        System.out.println("TOP LIVELIHOOD / JOB OPPORTUNITIES FOR: " + b.getName());
        System.out.println("=================================================");

        int rank = 1;
        for (Recommendation<Opportunity> rec : recommendations) {
            Opportunity opp = rec.getItem();
            System.out.println("\n" + rank + ". " + opp.getOpportunityName() + " (" + opp.getType() + ")");
            System.out.println("   Match Score: " + rec.getScore() + "%");
            System.out.println("   Region     : " + opp.getRegion() + " | Required Skill: " + opp.getRequiredSkill());
            System.out.println("   Description: " + opp.getDescription());
            System.out.println("   Why Recommended:");
            for (String reason : rec.getReasons()) {
                System.out.println("     • " + reason);
            }
            rank++;
        }
        System.out.println("=================================================\n");
    }

    public static List<Recommendation<Opportunity>> calculateOpportunityRecommendations(Beneficiary b) {
        List<Recommendation<Opportunity>> list = new ArrayList<>();
        String bSkills = b.getSkills() == null ? "" : b.getSkills();
        String bInterests = b.getInterests() == null ? "" : b.getInterests();
        String bAspirations = b.getAspirations() == null ? "" : b.getAspirations();
        String bRegion = b.getRegion() == null ? "All" : b.getRegion();
        String bEmpPref = b.getEmploymentPreference() == null ? "Both" : b.getEmploymentPreference();
        String bFamOcc = b.getFamilyOccupation() == null ? "" : b.getFamilyOccupation();

        for (Opportunity opp : opportunities) {
            double skillSim = calculateSemanticSimilarity(bSkills, opp.getRequiredSkill() + " " + opp.getOpportunityName());
            double interestSim = calculateSemanticSimilarity(bInterests, opp.getOpportunityName() + " " + opp.getDescription());
            double aspirationSim = calculateSemanticSimilarity(bAspirations, opp.getOpportunityName() + " " + opp.getType());
            double famSim = calculateSemanticSimilarity(bFamOcc, opp.getDescription() + " " + opp.getRequiredSkill());

            int score = 0;
            List<String> reasons = new ArrayList<>();

            // 1. Required Skill Match (Up to 35 pts)
            if (skillSim > 0.4) {
                int pts = (int)(skillSim * 35);
                score += pts;
                reasons.add(String.format("Core Qualification (%d%% Match): Fits role requirement for '%s'.", (int)(skillSim * 100), opp.getRequiredSkill()));
            }

            // 2. Interest Alignment (Up to 25 pts)
            if (interestSim > 0.4) {
                int pts = (int)(interestSim * 25);
                score += pts;
                reasons.add(String.format("Interest Congruence: Aligns with personal inclination towards %s.", bInterests));
            }

            // 3. Aspiration Alignment (Up to 20 pts)
            if (aspirationSim > 0.4) {
                int pts = (int)(aspirationSim * 20);
                score += pts;
                reasons.add(String.format("Career Goal: Directly fulfills your stated aspiration of '%s'.", bAspirations));
            }

            // 4. Regional Availability (Up to 10 pts)
            if (opp.getRegion().equalsIgnoreCase("All") || opp.getRegion().toLowerCase().contains(bRegion.toLowerCase()) || bRegion.toLowerCase().contains(opp.getRegion().toLowerCase())) {
                score += 10;
                reasons.add(String.format("Location Advantage: Immediate opening / enterprise cluster active in %s.", bRegion));
            } else {
                score += 4;
            }

            // 5. Employment Type Match (Up to 10 pts)
            if (bEmpPref.equalsIgnoreCase("Both") || bEmpPref.equalsIgnoreCase(opp.getType()) || opp.getType().equalsIgnoreCase("Both")) {
                score += 10;
                reasons.add(String.format("Work Mode Match: Fits preferred %s model.", opp.getType()));
            }

            // Additional professional reasons
            if (opp.getType().equalsIgnoreCase("Self Employment") || opp.getType().equalsIgnoreCase("Both")) {
                reasons.add("Credit Linkage: Micro-enterprise financing eligible under PM Mudra Scheme (₹50,000 to ₹5,00,000).");
            } else {
                reasons.add("Placement Tie-Up: Direct recruitment pipeline with verified regional corporate/government employers.");
            }

            score = Math.max(40, Math.min(98, score));
            list.add(new Recommendation<>(opp, score, reasons));
        }

        list.sort((r1, r2) -> Integer.compare(r2.getScore(), r1.getScore()));
        return list;
    }

    // ========================================================================
    // 5. VIEW PERSONALIZED LIVELIHOOD ROADMAP & SKILL GAP
    // ========================================================================
    private static void viewPersonalizedRoadmap(Scanner scanner) {
        System.out.println("\n-------------------------------------------------");
        System.out.println("         PERSONALIZED LIVELIHOOD ROADMAP         ");
        System.out.println("-------------------------------------------------");
        System.out.print("Enter Beneficiary ID: ");
        String id = scanner.nextLine().trim();

        Beneficiary b = findBeneficiaryById(id);
        if (b == null) {
            System.out.println("[X] Beneficiary with ID '" + id + "' not found.\n");
            return;
        }

        // Get top training & top opportunity recommendations
        List<Recommendation<TrainingProgram>> topTrainings = calculateTrainingRecommendations(b);
        List<Recommendation<Opportunity>> topOpportunities = calculateOpportunityRecommendations(b);

        TrainingProgram topTP = topTrainings.isEmpty() ? trainingPrograms.get(0) : topTrainings.get(0).getItem();
        Opportunity topOpp = topOpportunities.isEmpty() ? opportunities.get(0) : topOpportunities.get(0).getItem();

        // Perform Skill Gap Analysis
        List<String> missingSkills = performSkillGapAnalysis(b.getSkills(), topTP.getSkillsKeywords());

        System.out.println("\n====================================================================");
        System.out.println("         PERSONALIZED LIVELIHOOD ROADMAP FOR: " + b.getName().toUpperCase());
        System.out.println("====================================================================");
        System.out.println("Beneficiary ID: " + b.getId() + " | Current Status: " + b.getStatus());
        System.out.println("Region: " + b.getRegion() + " | Preference: " + b.getEmploymentPreference());
        System.out.println("--------------------------------------------------------------------");

        System.out.println("\n[STEP 1] CURRENT SKILLS BASELINE");
        System.out.println("         • Existing Skills: " + b.getSkills());
        System.out.println("         • Current Livelihood: " + b.getCurrentLivelihood());
        System.out.println("                 ↓");

        System.out.println("[STEP 2] TARGETED SKILL GAP BRIDGING");
        System.out.println("         • Target Programme: " + topTP.getProgramName());
        System.out.println("         • Core Curriculum: " + topTP.getSkillsKeywords());
        System.out.println("         • Skill Gaps Identified: " + (missingSkills.isEmpty() ? "None (Ready for direct placement)" : String.join(", ", missingSkills)));
        System.out.println("                 ↓");

        System.out.println("[STEP 3] NSQF ACCREDITED TRAINING");
        System.out.println("         • Programme: " + topTP.getProgramName() + " (NSQF Level " + topTP.getNsqfLevel() + ")");
        System.out.println("         • Duration : " + topTP.getDuration());
        System.out.println("         • Scheme   : PM-DAKSH / PMKVY 4.0 100% Fee Waiver & Stipend");
        System.out.println("                 ↓");

        System.out.println("[STEP 4] PRACTICAL ASSESSMENT & CERTIFICATION");
        System.out.println("         • Assessment Body: Sector Skill Council (SSC) / NCVET");
        System.out.println("         • Credential: DigiLocker Verified NSQF Certificate");
        System.out.println("                 ↓");

        System.out.println("[STEP 5] TARGET LIVELIHOOD & EMPLOYMENT LINKAGE");
        System.out.println("         • Role / Enterprise: " + topOpp.getOpportunityName() + " (" + topOpp.getType() + ")");
        System.out.println("         • Required Skill: " + topOpp.getRequiredSkill());
        System.out.println("                 ↓");

        System.out.println("[STEP 6] POST-PLACEMENT SUSTAINABILITY & CREDIT ACCESS");
        System.out.println("         • Mudra / Stand-Up India Working Capital Facilitation");
        System.out.println("         • Welfare Officer Continuous Milestone Tracking");
        System.out.println("====================================================================\n");
    }

    public static List<String> performSkillGapAnalysis(String existingSkills, String requiredSkills) {
        List<String> gaps = new ArrayList<>();
        if (requiredSkills == null || requiredSkills.isEmpty()) return gaps;

        String[] reqArray = requiredSkills.split("[,;]+");
        String existingLower = (existingSkills == null ? "" : existingSkills).toLowerCase();

        for (String req : reqArray) {
            req = req.trim();
            if (req.length() > 2) {
                // Check if existing contains keyword or synonym
                boolean matched = existingLower.contains(req.toLowerCase());
                if (!matched) {
                    for (String token : req.toLowerCase().split("\\s+")) {
                        if (token.length() > 3 && existingLower.contains(token)) {
                            matched = true;
                            break;
                        }
                    }
                }
                if (!matched && !gaps.contains(req)) {
                    gaps.add(req);
                }
            }
        }
        return gaps;
    }

    // ========================================================================
    // 6. UPDATE TRAINING / PLACEMENT STATUS
    // ========================================================================
    private static void updateTrainingPlacementStatus(Scanner scanner) {
        System.out.println("\n-------------------------------------------------");
        System.out.println("      UPDATE TRAINING & PLACEMENT STATUS         ");
        System.out.println("-------------------------------------------------");
        System.out.print("Enter Beneficiary ID: ");
        String id = scanner.nextLine().trim();

        Beneficiary b = findBeneficiaryById(id);
        if (b == null) {
            System.out.println("[X] Beneficiary with ID '" + id + "' not found.\n");
            return;
        }

        System.out.println("\nCurrent Status for " + b.getName() + ": " + b.getStatus());
        System.out.println("\nSelect New Pipeline Status:");
        System.out.println("1. Profile Created");
        System.out.println("2. Recommendation Generated");
        System.out.println("3. Enrolled");
        System.out.println("4. Training In Progress");
        System.out.println("5. Training Completed");
        System.out.println("6. Placed");
        System.out.println("7. Self-Employment Started");
        System.out.println("8. Needs Officer Support");
        System.out.print("Choice (1-8): ");
        String choice = scanner.nextLine().trim();

        String newStatus = switch (choice) {
            case "1" -> "Profile Created";
            case "2" -> "Recommendation Generated";
            case "3" -> "Enrolled";
            case "4" -> "Training In Progress";
            case "5" -> "Training Completed";
            case "6" -> "Placed";
            case "7" -> "Self-Employment Started";
            case "8" -> "Needs Officer Support";
            default -> {
                System.out.println("[X] Invalid status selection.\n");
                yield null;
            }
        };

        if (newStatus == null) {
            return;
        }

        b.setStatus(newStatus);
        saveBeneficiaryToDb(b);
        System.out.println("\n[✓] Status updated successfully to: '" + newStatus + "' for " + b.getName() + ".\n");

        if (newStatus.equalsIgnoreCase("Needs Officer Support")) {
            System.out.println("-------------------------------------------------");
            System.out.println("⚠️ HUMAN-IN-THE-LOOP ALERT TRIGGERED!");
            System.out.println("This beneficiary requires human assistance.");
            System.out.println("Please review profile & recommendations in Officer Dashboard.");
            System.out.println("-------------------------------------------------\n");
        }
    }

    // ========================================================================
    // 7. OFFICER DASHBOARD (Monitoring & Pipeline)
    // ========================================================================
    private static void officerDashboard(Scanner scanner) {
        System.out.println("\n=================================================");
        System.out.println("            DISTRICT OFFICER DASHBOARD           ");
        System.out.println("    Training-to-Placement Pipeline Monitoring    ");
        System.out.println("=================================================");

        int total = beneficiaries.size();
        int profilesCreated = 0;
        int recGenerated = 0;
        int enrolled = 0;
        int inProgress = 0;
        int completed = 0;
        int placed = 0;
        int selfEmployed = 0;
        int needsSupport = 0;

        for (Beneficiary b : beneficiaries) {
            String s = b.getStatus().toLowerCase();
            if (s.contains("profile created")) profilesCreated++;
            else if (s.contains("recommendation")) recGenerated++;
            else if (s.contains("enrolled")) enrolled++;
            else if (s.contains("in progress")) inProgress++;
            else if (s.contains("completed")) completed++;
            else if (s.contains("placed")) placed++;
            else if (s.contains("self-employment")) selfEmployed++;
            else if (s.contains("needs officer support")) needsSupport++;
        }

        System.out.println("SYSTEM METRICS:");
        System.out.println("• Total Beneficiaries Registered : " + total);
        System.out.println("• Profiles Created               : " + profilesCreated);
        System.out.println("• Recommendations Generated      : " + recGenerated);
        System.out.println("• Enrolled in Training           : " + enrolled);
        System.out.println("• Training In Progress           : " + inProgress);
        System.out.println("• Training Completed             : " + completed);
        System.out.println("• Placed in Wage Employment      : " + placed);
        System.out.println("• Self-Employment Started        : " + selfEmployed);
        System.out.println("• Requires Officer Support (HITL): " + needsSupport);
        System.out.println("-------------------------------------------------");

        System.out.println("\nBENEFICIARY PIPELINE OVERVIEW:");
        System.out.printf("%-6s | %-18s | %-15s | %-22s\n", "ID", "Name", "Region", "Status");
        System.out.println("-------------------------------------------------------------------");
        for (Beneficiary b : beneficiaries) {
            System.out.printf("%-6s | %-18s | %-15s | %-22s\n",
                    b.getId(), truncate(b.getName(), 18), truncate(b.getRegion(), 15), b.getStatus());
        }
        System.out.println("-------------------------------------------------------------------");

        if (needsSupport > 0) {
            System.out.println("\n⚠️ ATTENTION: There are " + needsSupport + " beneficiary(ies) marked 'Needs Officer Support'.");
            System.out.print("Would you like to review Human-in-the-Loop cases now? (y/n): ");
            String ans = scanner.nextLine().trim();
            if (ans.equalsIgnoreCase("y")) {
                for (Beneficiary b : beneficiaries) {
                    if (b.getStatus().equalsIgnoreCase("Needs Officer Support")) {
                        System.out.println("\n=================================================");
                        System.out.println("HUMAN-IN-THE-LOOP ASSISTANCE REVIEW: " + b.getName());
                        System.out.println("=================================================");
                        System.out.println("This beneficiary requires human assistance.");
                        System.out.println("Please review the profile and recommendation before proceeding.");
                        printBeneficiaryProfileDetails(b);
                    }
                }
            }
        }
        System.out.println();
    }

    private static String truncate(String text, int width) {
        if (text == null) return "";
        if (text.length() <= width) return text;
        return text.substring(0, width - 2) + "..";
    }

    // ========================================================================
    // 8. VIEW TRAINING PROGRAMMES (NSQF Aligned)
    // ========================================================================
    private static void viewTrainingPrograms() {
        System.out.println("\n=================================================");
        System.out.println("   AVAILABLE NSQF-ALIGNED TRAINING PROGRAMMES   ");
        System.out.println("=================================================");
        for (TrainingProgram tp : trainingPrograms) {
            System.out.println("ID        : " + tp.getTrainingId());
            System.out.println("Programme : " + tp.getProgramName() + " (NSQF Level " + tp.getNsqfLevel() + ")");
            System.out.println("Region    : " + tp.getRegion() + " | Type: " + tp.getEmploymentType());
            System.out.println("Duration  : " + tp.getDuration());
            System.out.println("Keywords  : " + tp.getSkillsKeywords());
            System.out.println("Description: " + tp.getDescription());
            System.out.println("-------------------------------------------------");
        }
        System.out.println();
    }

    // ========================================================================
    // 9. VIEW LOCAL OPPORTUNITIES
    // ========================================================================
    private static void viewLocalOpportunities() {
        System.out.println("\n=================================================");
        System.out.println("      LOCAL JOB & LIVELIHOOD OPPORTUNITIES       ");
        System.out.println("=================================================");
        for (Opportunity opp : opportunities) {
            System.out.println("ID         : " + opp.getOpportunityId());
            System.out.println("Opportunity: " + opp.getOpportunityName() + " (" + opp.getType() + ")");
            System.out.println("Region     : " + opp.getRegion());
            System.out.println("Req Skill  : " + opp.getRequiredSkill());
            System.out.println("Description: " + opp.getDescription());
            System.out.println("-------------------------------------------------");
        }
        System.out.println();
    }

    // ========================================================================
    // 10. SEARCH BENEFICIARY
    // ========================================================================
    private static void searchBeneficiary(Scanner scanner) {
        System.out.println("\n-------------------------------------------------");
        System.out.println("               SEARCH BENEFICIARY                ");
        System.out.println("-------------------------------------------------");
        System.out.print("Enter Search Term (ID / Name / Phone / Region): ");
        String query = scanner.nextLine().trim().toLowerCase();

        if (query.isEmpty()) {
            System.out.println("[X] Search query cannot be empty.\n");
            return;
        }

        List<Beneficiary> results = new ArrayList<>();
        for (Beneficiary b : beneficiaries) {
            if (b.getId().toLowerCase().contains(query) ||
                b.getName().toLowerCase().contains(query) ||
                b.getPhone().toLowerCase().contains(query) ||
                b.getRegion().toLowerCase().contains(query)) {
                results.add(b);
            }
        }

        if (results.isEmpty()) {
            System.out.println("[!] No beneficiaries matching '" + query + "' were found.\n");
        } else {
            System.out.println("\n[✓] Found " + results.size() + " matching beneficiary(ies):");
            for (Beneficiary b : results) {
                printBeneficiaryProfileDetails(b);
            }
        }
    }

    // ========================================================================
    // 11 & 12. DATA PERSISTENCE (SQLITE SAATHI.DB)
    // ========================================================================
    public static void saveBeneficiaryToDb(Beneficiary b) {
        String sql = """
            INSERT INTO beneficiaries (
                id, name, phone, language, education, family_occupation,
                current_livelihood, skills, interests, aspirations, constraints,
                employment_preference, region, status, registration_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                name=excluded.name,
                phone=excluded.phone,
                language=excluded.language,
                education=excluded.education,
                family_occupation=excluded.family_occupation,
                current_livelihood=excluded.current_livelihood,
                skills=excluded.skills,
                interests=excluded.interests,
                aspirations=excluded.aspirations,
                constraints=excluded.constraints,
                employment_preference=excluded.employment_preference,
                region=excluded.region,
                status=excluded.status,
                registration_date=excluded.registration_date;
        """;
        try (Connection conn = getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, b.getId());
            pstmt.setString(2, b.getName());
            pstmt.setString(3, b.getPhone());
            pstmt.setString(4, b.getLanguage());
            pstmt.setString(5, b.getEducation());
            pstmt.setString(6, b.getFamilyOccupation());
            pstmt.setString(7, b.getCurrentLivelihood());
            pstmt.setString(8, b.getSkills());
            pstmt.setString(9, b.getInterests());
            pstmt.setString(10, b.getAspirations());
            pstmt.setString(11, b.getConstraints());
            pstmt.setString(12, b.getEmploymentPreference());
            pstmt.setString(13, b.getRegion());
            pstmt.setString(14, b.getStatus());
            pstmt.setString(15, b.getRegistrationDate());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[X] Error saving beneficiary to SQLite 'saathi.db': " + e.getMessage());
        }
    }

    private static void saveTrainingProgramToDb(TrainingProgram tp) {
        String sql = """
            INSERT INTO training_programs (
                training_id, program_name, nsqf_level, region, employment_type,
                skills_keywords, duration, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(training_id) DO UPDATE SET
                program_name=excluded.program_name,
                nsqf_level=excluded.nsqf_level,
                region=excluded.region,
                employment_type=excluded.employment_type,
                skills_keywords=excluded.skills_keywords,
                duration=excluded.duration,
                description=excluded.description;
        """;
        try (Connection conn = getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, tp.getTrainingId());
            pstmt.setString(2, tp.getProgramName());
            pstmt.setInt(3, tp.getNsqfLevel());
            pstmt.setString(4, tp.getRegion());
            pstmt.setString(5, tp.getEmploymentType());
            pstmt.setString(6, tp.getSkillsKeywords());
            pstmt.setString(7, tp.getDuration());
            pstmt.setString(8, tp.getDescription());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[X] Error saving training program to SQLite: " + e.getMessage());
        }
    }

    private static void saveOpportunityToDb(Opportunity opp) {
        String sql = """
            INSERT INTO opportunities (
                opportunity_id, opportunity_name, region, type, required_skill, description
            ) VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(opportunity_id) DO UPDATE SET
                opportunity_name=excluded.opportunity_name,
                region=excluded.region,
                type=excluded.type,
                required_skill=excluded.required_skill,
                description=excluded.description;
        """;
        try (Connection conn = getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, opp.getOpportunityId());
            pstmt.setString(2, opp.getOpportunityName());
            pstmt.setString(3, opp.getRegion());
            pstmt.setString(4, opp.getType());
            pstmt.setString(5, opp.getRequiredSkill());
            pstmt.setString(6, opp.getDescription());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[X] Error saving opportunity to SQLite: " + e.getMessage());
        }
    }

    private static void saveData() {
        int count = 0;
        for (Beneficiary b : beneficiaries) {
            saveBeneficiaryToDb(b);
            count++;
        }
        System.out.println("[✓] " + count + " beneficiary record(s) persisted to 'saathi.db'.");
    }

    public static void loadData() {
        beneficiaries.clear();
        String sql = "SELECT * FROM beneficiaries ORDER BY CAST(id AS INTEGER) ASC";
        int maxId = 1000;
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                Beneficiary b = new Beneficiary(
                        rs.getString("id"),
                        rs.getString("name"),
                        rs.getString("phone"),
                        rs.getString("language"),
                        rs.getString("education"),
                        rs.getString("family_occupation"),
                        rs.getString("current_livelihood"),
                        rs.getString("skills"),
                        rs.getString("interests"),
                        rs.getString("aspirations"),
                        rs.getString("constraints"),
                        rs.getString("employment_preference"),
                        rs.getString("region"),
                        rs.getString("status"),
                        rs.getString("registration_date")
                );
                beneficiaries.add(b);
                try {
                    int idNum = Integer.parseInt(b.getId());
                    if (idNum > maxId) maxId = idNum;
                } catch (NumberFormatException ignored) {}
            }

            if (beneficiaries.isEmpty()) {
                migrateLegacyTextData();
                return;
            }

            nextBeneficiaryId = maxId + 1;
            System.out.println("[✓] Loaded " + beneficiaries.size() + " beneficiary record(s) from 'saathi.db'.");
        } catch (SQLException e) {
            System.out.println("[X] Warning: Could not load saved data from SQLite: " + e.getMessage());
        }
    }

    private static void migrateLegacyTextData() {
        File file = new File("saathi_beneficiaries.txt");
        if (!file.exists()) return;

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            int maxId = 1000;
            int count = 0;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                Beneficiary b = Beneficiary.fromDataString(line);
                if (b != null) {
                    beneficiaries.add(b);
                    saveBeneficiaryToDb(b);
                    count++;
                    try {
                        int idNum = Integer.parseInt(b.getId());
                        if (idNum > maxId) maxId = idNum;
                    } catch (NumberFormatException ignored) {}
                }
            }
            nextBeneficiaryId = maxId + 1;
            if (count > 0) {
                System.out.println("[✓] Migrated " + count + " legacy record(s) from 'saathi_beneficiaries.txt' to 'saathi.db'.");
            }
        } catch (IOException e) {
            System.out.println("[X] Warning: Could not migrate legacy text data: " + e.getMessage());
        }
    }

    // ========================================================================
    // SAMPLE DATA INITIALIZATION
    // ========================================================================
    public static void loadSampleData() {
        trainingPrograms.clear();
        opportunities.clear();

        // 1. Seed Training Programs if DB table is empty
        List<TrainingProgram> samplePrograms = Arrays.asList(
                new TrainingProgram("TP101", "Digital Office Skills & Data Digitization", 4, "All", "Wage Employment",
                        "Basic Computer, Typing, Data Entry, Spreadsheet, MS Office, Digital Office", "3 Months",
                        "Foundation course in IT skills, spreadsheet accounting, document digitization and digital office administration."),
                new TrainingProgram("TP102", "Tailoring, Fashion Design & Boutique Management", 3, "Rural", "Self Employment",
                        "Sewing, Stitching, Tailoring, Garment Design, Embroidery, Pattern Making, Business", "4 Months",
                        "Apparel construction, blouse and dressmaking, embroidery, boutique budgeting, and micro-enterprise management."),
                new TrainingProgram("TP103", "Solar PV Rooftop & Inverter Technician", 4, "All", "Both",
                        "Solar, Solar Panel, Inverter, Wiring, Electrical, Installation, Rooftop, Renewable", "5 Months",
                        "Grid-tied and off-grid solar PV installation, inverter troubleshooting, battery maintenance, and Suryamitra certification."),
                new TrainingProgram("TP104", "Food Processing, Bakery & Quality Control", 3, "Rural", "Self Employment",
                        "Food Processing, Packaging, Food Safety, Bakery, Preserves, Pickles, Spices, FSSAI", "3 Months",
                        "Commercial preparation of regional snacks, bakery items, spices, and fruit preserves with FSSAI hygiene standards."),
                new TrainingProgram("TP105", "Computer Hardware, Networking & IoT Support", 4, "Urban", "Wage Employment",
                        "Hardware, PC Repair, Networking, Troubleshooting, PC Assembly, Router, IoT Support", "6 Months",
                        "Component-level desktop and laptop repair, network cabling, OS installation, and IoT peripheral support."),
                new TrainingProgram("TP106", "Beauty, Wellness & Cosmetology Entrepreneurship", 3, "All", "Both",
                        "Skincare, Hair Styling, Salon Management, Beauty, Makeup, Cosmetology, Bridal", "3 Months",
                        "Professional skincare, hair styling, bridal makeup, salon sanitation, and home parlour business startup."),
                new TrainingProgram("TP107", "Organic Farming, Vermiculture & Agritech Management", 4, "Rural", "Both",
                        "Farming, Organic Agriculture, Crop Management, Soil Testing, Vermicompost, Bio-Fertilizer, Drip Irrigation", "4 Months",
                        "Sustainable organic farming methods, natural pest management, vermiculture production, and direct FPO marketplace linkages."),
                new TrainingProgram("TP108", "Handloom Weaving & Artisan Cluster Production", 3, "Rural", "Self Employment",
                        "Handicrafts, Weaving, Handloom, Pottery, Artisan Work, Wood Carving, Textile Craft", "3 Months",
                        "Traditional handloom weaving techniques, motif design, natural dyeing, and e-commerce cluster marketing."),
                new TrainingProgram("TP109", "Electric Vehicle (EV) 2 & 3 Wheeler Service Technician", 4, "All", "Wage Employment",
                        "EV, Electric Vehicle, Battery Maintenance, Motor Controller, Automobile, Wiring, Bike Repair", "5 Months",
                        "Diagnostics and repair of electric scooters, e-rickshaws, lithium battery pack management, and regenerative braking systems."),
                new TrainingProgram("TP110", "Healthcare General Duty Assistant (GDA) & Patient Care", 4, "All", "Wage Employment",
                        "Healthcare, Nursing, Patient Care, First Aid, Vital Signs, Elderly Care, Hospital, Clinic", "6 Months",
                        "Bedside patient assistance, vital signs monitoring, infection control, first aid, and hospital ward management aligned with HSSC."),
                new TrainingProgram("TP111", "Agricultural Drone Pilot & Precision Spraying", 4, "Rural", "Both",
                        "Drone, Drone Pilot, Agriculture, Crop Spraying, Aerial Survey, GPS, Farm Tech", "3 Months",
                        "DGCA-compliant remote pilot certification, agricultural payload spraying, multispectral crop health survey, and maintenance."),
                new TrainingProgram("TP112", "Commercial Driving, Heavy Vehicle & Logistics Operations", 4, "Urban", "Wage Employment",
                        "Driving, Commercial Vehicle, Logistics, Fleet Management, Cargo, GPS Navigation, Safety", "3 Months",
                        "Defensive driving, heavy commercial vehicle operation, GPS route planning, warehouse logistics, and fuel efficiency."),
                new TrainingProgram("TP113", "Modern Plumbing, Sanitary & Water Purification Tech", 3, "All", "Both",
                        "Plumbing, Sanitary, Pipe Fitting, Water Purification, RO System, Drainage, Pump Repair", "3 Months",
                        "Domestic and industrial pipe installations, RO water purifier maintenance, pressure pump fixing, and sanitary fittings."),
                new TrainingProgram("TP114", "CNC Machine Operator & Precision Engineering", 4, "Urban", "Wage Employment",
                        "CNC, Machine Operator, Lathe, Milling, Precision Machining, Tooling, Blueprints", "6 Months",
                        "G-code/M-code programming basics, CNC lathe and milling operation, precision dimensional inspection, and workshop safety."),
                new TrainingProgram("TP115", "Mobile Phone & Smart Device Hardware Repair", 4, "All", "Both",
                        "Mobile Repair, Smartphone, Hardware, Screen Replacement, Motherboard, Soldering, Chip-Level", "4 Months",
                        "SMD soldering, touch screen replacement, IC diagnosis, water-damage repair, and software flashing for all smartphone brands."),
                new TrainingProgram("TP116", "Dairy Farming, Cattle Management & Milk Processing", 3, "Rural", "Both",
                        "Dairy, Cattle, Milk Processing, Animal Husbandry, Dairy Farm, Ghee, Butter, Fodder", "3 Months",
                        "Scientific cattle feed management, hygienic automated milking, milk quality testing, and value-added dairy product production."),
                new TrainingProgram("TP117", "AI Data Annotation, Prompt Curation & Digital Verification", 4, "All", "Wage Employment",
                        "AI, Data Annotation, Data Labeling, Prompting, Content Moderation, Quality Check, Computer", "3 Months",
                        "Image bounding boxes, speech text transcription, NLP data labeling, and AI training dataset verification for global tech platforms."),
                new TrainingProgram("TP118", "HVAC, Air Conditioner & Refrigeration Technician", 4, "Urban", "Both",
                        "AC Repair, HVAC, Refrigeration, Cooling, Compressor, Gas Charging, Appliance Maintenance", "5 Months",
                        "Split/Inverter AC installation, copper brazing, refrigerant vacuuming & gas charging, and domestic refrigerator troubleshooting."),
                new TrainingProgram("TP119", "Renewable Energy & Community Bio-Gas Plant Operator", 4, "Rural", "Both",
                        "Bio-Gas, Renewable Energy, Waste Management, Digester, Bio-Fertilizer, Sustainability", "4 Months",
                        "Community bio-gas plant operation, substrate slurry feeding, methane output regulation, and enriched organic bio-manure bagging."),
                new TrainingProgram("TP120", "Banking Correspondent, Microfinance & Insurance Agent", 4, "All", "Both",
                        "Banking, Microfinance, Loan, Insurance, Accounting, POS Terminal, Financial Inclusion", "3 Months",
                        "Aadhaar Enabled Payment System (AePS), SHG micro-credit underwriting, PM-JJBY/PM-SBY enrolment, and digital ledger keeping."),
                new TrainingProgram("TP121", "Web Development & E-Commerce Store Management", 5, "Urban", "Both",
                        "Web Development, HTML, CSS, JavaScript, E-Commerce, Shopify, Website Management", "6 Months",
                        "Responsive website development, product catalog upload, online payment gateway integration, and local merchant store setup."),
                new TrainingProgram("TP122", "Culinary Arts, Catering & Cloud Kitchen Management", 4, "All", "Both",
                        "Cooking, Culinary, Catering, Cloud Kitchen, Food Preparation, Chef, Hygiene", "4 Months",
                        "Quantity food preparation, nutritional meal planning, commercial kitchen ergonomics, and online food aggregator operations."),
                new TrainingProgram("TP123", "Ayush Therapy & Herbal Wellness Assistant", 3, "All", "Both",
                        "Ayurveda, Herbal, Wellness, Yoga, Naturopathy, Therapy Assistant, Massage", "4 Months",
                        "Classical Panchakarma assistant procedures, medicinal herb preparation, therapeutic wellness routines, and holistic care."),
                new TrainingProgram("TP124", "Eco-Friendly Jute, Bamboo & Fibre Craft Production", 3, "Rural", "Self Employment",
                        "Bamboo, Jute, Eco-Craft, Basketry, Fibre, Sustainable Products, Artisan", "3 Months",
                        "Crafting biodegradable packaging bags, bamboo home decor, floor mats, and direct supply to eco-conscious urban retailers."),
                new TrainingProgram("TP125", "CCTV, Security Systems & Smart Surveillance Tech", 4, "Urban", "Both",
                        "CCTV, Security, Surveillance, IP Camera, DVR, NVR, Access Control, Cabling", "3 Months",
                        "IP camera networking, DVR/NVR configuration, biometric access control, remote mobile surveillance setup, and perimeter alarm fixing.")
        );

        for (TrainingProgram tp : samplePrograms) {
            saveTrainingProgramToDb(tp);
        }

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM training_programs")) {
            while (rs.next()) {
                trainingPrograms.add(new TrainingProgram(
                        rs.getString("training_id"),
                        rs.getString("program_name"),
                        rs.getInt("nsqf_level"),
                        rs.getString("region"),
                        rs.getString("employment_type"),
                        rs.getString("skills_keywords"),
                        rs.getString("duration"),
                        rs.getString("description")
                ));
            }
        } catch (SQLException e) {
            System.err.println("[X] Warning: Could not load training programs from SQLite DB: " + e.getMessage());
        }

        // 2. Seed Opportunities if DB table is empty
        List<Opportunity> sampleOpps = Arrays.asList(
                new Opportunity("OP201", "District e-Governance Center Data Operator", "Urban", "Wage Employment",
                        "Data Entry", "Digital data indexing, citizen records updating, and e-district portal operations."),
                new Opportunity("OP202", "Custom Tailoring & Designer Boutique", "Rural", "Self Employment",
                        "Tailoring", "Establish a standalone tailoring shop supported by Mudra Shishu/Kishore loan."),
                new Opportunity("OP203", "Rooftop Solar PV Installation Technician", "All", "Wage Employment",
                        "Solar Panel", "Deploy and connect rooftop solar grids with state power distribution companies."),
                new Opportunity("OP204", "Agro-Food Processing SHG Enterprise", "Rural", "Self Employment",
                        "Food Processing", "Manufacturing packaged regional pickles, spices, and flours for retail distribution."),
                new Opportunity("OP205", "Municipal IT & Hardware Support Assistant", "Urban", "Wage Employment",
                        "Hardware", "Desktop, printer, and LAN network maintenance across local government administrative offices."),
                new Opportunity("OP206", "Artisan Cluster Handicraft Producer", "Rural", "Self Employment",
                        "Handicrafts", "Handmade craft artifact creation for export councils and TRIFED retail network."),
                new Opportunity("OP207", "Certified Organic Produce Supplier to FPO", "Rural", "Both",
                        "Farming", "Cultivate and deliver residue-free organic crops to Farmer Producer Company clusters."),
                new Opportunity("OP208", "Electric Vehicle Dealership Service Specialist", "All", "Wage Employment",
                        "Electric Vehicle", "Perform electrical troubleshooting and battery servicing at regional EV dealerships."),
                new Opportunity("OP209", "Hospital & Clinic Patient Care Assistant", "All", "Wage Employment",
                        "Patient Care", "Support hospital nursing staff in bedside patient monitoring and OPD coordination."),
                new Opportunity("OP210", "Agricultural Drone Spraying & Survey Contractor", "Rural", "Both",
                        "Drone Pilot", "Provide paid drone crop spraying and soil analysis services to village farm cooperatives."),
                new Opportunity("OP211", "Regional E-Commerce Logistics Hub Driver", "Urban", "Wage Employment",
                        "Driving", "Commercial cargo distribution, delivery tracking, and last-mile transport."),
                new Opportunity("OP212", "Sanitary, Plumbing & RO Service Contractor", "All", "Both",
                        "Plumbing", "Execute residential plumbing contracts and annual RO water purification AMC servicing."),
                new Opportunity("OP213", "Precision Tooling CNC Machinist", "Urban", "Wage Employment",
                        "CNC", "Operate automated CNC machinery in auto-ancillary and precision manufacturing factories."),
                new Opportunity("OP214", "Multi-Brand Smartphone Repair Shop", "All", "Self Employment",
                        "Mobile Repair", "Run an independent gadget repair and screen restoration counter."),
                new Opportunity("OP215", "Cooperative Dairy & Milk Collection Center", "Rural", "Both",
                        "Dairy", "Manage automated milk collection, testing, and cooperative supply to state dairy federations."),
                new Opportunity("OP216", "AI Machine Learning Data Labeler", "All", "Wage Employment",
                        "Data Annotation", "Annotate computer vision and text datasets remotely for Indian AI research hubs."),
                new Opportunity("OP217", "HVAC & Residential AC Repair Service Provider", "Urban", "Both",
                        "AC Repair", "Provide seasonal AC installation, gas charging, and appliance repair services."),
                new Opportunity("OP218", "Community Bio-Gas & Waste-to-Energy Operator", "Rural", "Wage Employment",
                        "Bio-Gas", "Operate anaerobic digesters and package bio-fertilizers under Gobardhan scheme."),
                new Opportunity("OP219", "Bank Mitra / Financial Inclusion Agent", "All", "Both",
                        "Banking", "Facilitate village-level cash withdrawals, pension disbursement, and PM insurance schemes."),
                new Opportunity("OP220", "Local Merchant E-Commerce Web Administrator", "Urban", "Wage Employment",
                        "Web Development", "Manage digital catalogs, orders, and social media shop fronts for local MSME traders."),
                new Opportunity("OP221", "Cloud Kitchen & Event Catering Entrepreneur", "All", "Self Employment",
                        "Cooking", "Operate delivery-first meal kitchens and institutional food catering services."),
                new Opportunity("OP222", "Ayurvedic Hospital & Spa Wellness Aide", "All", "Wage Employment",
                        "Ayurveda", "Assist certified Ayurvedic doctors in treatment therapies and herbal wellness care."),
                new Opportunity("OP223", "Eco-Friendly Bamboo Craft & Decor Unit", "Rural", "Self Employment",
                        "Bamboo", "Design and sell eco-friendly bamboo utensils, baskets, and lifestyle decor."),
                new Opportunity("OP224", "CCTV Surveillance & Home Automation Tech", "Urban", "Both",
                        "CCTV", "Install security cameras, video doorbells, and network monitoring for commercial premises."),
                new Opportunity("OP225", "Unisex Beauty Salon & Bridal Studio", "All", "Self Employment",
                        "Beauty", "Own and run a neighbourhood salon specializing in haircuts, styling, and bridal services.")
        );

        for (Opportunity opp : sampleOpps) {
            saveOpportunityToDb(opp);
        }

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM opportunities")) {
            while (rs.next()) {
                opportunities.add(new Opportunity(
                        rs.getString("opportunity_id"),
                        rs.getString("opportunity_name"),
                        rs.getString("region"),
                        rs.getString("type"),
                        rs.getString("required_skill"),
                        rs.getString("description")
                ));
            }
        } catch (SQLException e) {
            System.err.println("[X] Warning: Could not load opportunities from SQLite DB: " + e.getMessage());
        }
    }

    // ========================================================================
    // ONBOARDING SESSION PERSISTENCE
    // ========================================================================

    public static void saveOnboardingSessionToDb(BeneficiaryOnboardingSession s) {
        String sql = """
            INSERT INTO onboarding_sessions (
                session_id, mode, language, current_step, collected_json,
                status, beneficiary_id, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(session_id) DO UPDATE SET
                mode=excluded.mode,
                language=excluded.language,
                current_step=excluded.current_step,
                collected_json=excluded.collected_json,
                status=excluded.status,
                beneficiary_id=excluded.beneficiary_id,
                updated_at=excluded.updated_at;
        """;
        try (Connection conn = getConnection(); PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, s.sessionId);
            ps.setString(2, s.mode);
            ps.setString(3, s.language);
            ps.setInt(4, s.currentStep);
            ps.setString(5, s.collectedDataToJson());
            ps.setString(6, s.status);
            ps.setString(7, s.beneficiaryId);
            ps.setString(8, s.createdAt);
            ps.setString(9, new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(new java.util.Date()));
            ps.executeUpdate();
        } catch (SQLException e) {
            System.err.println("[X] Error saving onboarding session: " + e.getMessage());
        }
    }

    // ========================================================================
    // NESTED CLASSES (OOP MODELS)
    // ========================================================================

    /**
     * Beneficiary Data Model
     */
    public static class Beneficiary {
        private final String id;
        private final String name;
        private final String phone;
        private final String language;
        private final String education;
        private final String familyOccupation;
        private final String currentLivelihood;
        private final String skills;
        private final String interests;
        private final String aspirations;
        private final String constraints;
        private final String employmentPreference;
        private final String region;
        private String status;
        private final String registrationDate;

        public Beneficiary(String id, String name, String phone, String language, String education,
                           String familyOccupation, String currentLivelihood, String skills,
                           String interests, String aspirations, String constraints,
                           String employmentPreference, String region, String status, String registrationDate) {
            this.id = id;
            this.name = name;
            this.phone = phone;
            this.language = language;
            this.education = education;
            this.familyOccupation = familyOccupation;
            this.currentLivelihood = currentLivelihood;
            this.skills = skills;
            this.interests = interests;
            this.aspirations = aspirations;
            this.constraints = constraints;
            this.employmentPreference = employmentPreference;
            this.region = region;
            this.status = status;
            this.registrationDate = registrationDate;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public String getPhone() { return phone; }
        public String getLanguage() { return language; }
        public String getEducation() { return education; }
        public String getFamilyOccupation() { return familyOccupation; }
        public String getCurrentLivelihood() { return currentLivelihood; }
        public String getSkills() { return skills; }
        public String getInterests() { return interests; }
        public String getAspirations() { return aspirations; }
        public String getConstraints() { return constraints; }
        public String getEmploymentPreference() { return employmentPreference; }
        public String getRegion() { return region; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getRegistrationDate() { return registrationDate; }

        public String toDataString() {
            return id + "|" + escape(name) + "|" + escape(phone) + "|" + escape(language) + "|" +
                   escape(education) + "|" + escape(familyOccupation) + "|" + escape(currentLivelihood) + "|" +
                   escape(skills) + "|" + escape(interests) + "|" + escape(aspirations) + "|" +
                   escape(constraints) + "|" + escape(employmentPreference) + "|" + escape(region) + "|" +
                   escape(status) + "|" + escape(registrationDate);
        }

        public static Beneficiary fromDataString(String line) {
            String[] parts = line.split("\\|", -1);
            if (parts.length < 15) return null;
            return new Beneficiary(
                    parts[0], unescape(parts[1]), unescape(parts[2]), unescape(parts[3]),
                    unescape(parts[4]), unescape(parts[5]), unescape(parts[6]), unescape(parts[7]),
                    unescape(parts[8]), unescape(parts[9]), unescape(parts[10]), unescape(parts[11]),
                    unescape(parts[12]), unescape(parts[13]), unescape(parts[14])
            );
        }

        private static String escape(String str) {
            if (str == null) return "";
            return str.replace("|", ";");
        }

        private static String unescape(String str) {
            if (str == null) return "";
            return str.replace(";", "|");
        }
    }

    /**
     * Training Program Data Model
     */
    public static class TrainingProgram {
        private final String trainingId;
        private final String programName;
        private final int nsqfLevel;
        private final String region;
        private final String employmentType;
        private final String skillsKeywords;
        private final String duration;
        private final String description;

        public TrainingProgram(String trainingId, String programName, int nsqfLevel, String region,
                               String employmentType, String skillsKeywords, String duration, String description) {
            this.trainingId = trainingId;
            this.programName = programName;
            this.nsqfLevel = nsqfLevel;
            this.region = region;
            this.employmentType = employmentType;
            this.skillsKeywords = skillsKeywords;
            this.duration = duration;
            this.description = description;
        }

        public String getTrainingId() { return trainingId; }
        public String getProgramName() { return programName; }
        public int getNsqfLevel() { return nsqfLevel; }
        public String getRegion() { return region; }
        public String getEmploymentType() { return employmentType; }
        public String getSkillsKeywords() { return skillsKeywords; }
        public String getDuration() { return duration; }
        public String getDescription() { return description; }
    }

    /**
     * Opportunity Data Model
     */
    public static class Opportunity {
        private final String opportunityId;
        private final String opportunityName;
        private final String region;
        private final String type;
        private final String requiredSkill;
        private final String description;

        public Opportunity(String opportunityId, String opportunityName, String region,
                           String type, String requiredSkill, String description) {
            this.opportunityId = opportunityId;
            this.opportunityName = opportunityName;
            this.region = region;
            this.type = type;
            this.requiredSkill = requiredSkill;
            this.description = description;
        }

        public String getOpportunityId() { return opportunityId; }
        public String getOpportunityName() { return opportunityName; }
        public String getRegion() { return region; }
        public String getType() { return type; }
        public String getRequiredSkill() { return requiredSkill; }
        public String getDescription() { return description; }
    }

    /**
     * Recommendation Helper Wrapper Model
     */
    public static class Recommendation<T> {
        private final T item;
        private final int score;
        private final List<String> reasons;

        public Recommendation(T item, int score, List<String> reasons) {
            this.item = item;
            this.score = score;
            this.reasons = reasons;
        }

        public T getItem() { return item; }
        public int getScore() { return score; }
        public List<String> getReasons() { return reasons; }
    }

    // ========================================================================
    // BENEFICIARY ONBOARDING SESSION STATE MACHINE
    // ========================================================================

    /**
     * Holds the full conversational state for one onboarding session.
     * Fields map 1-to-1 with the 10 registration questions.
     */
    public static class BeneficiaryOnboardingSession {
        public String sessionId;
        public String mode;       // "direct" | "voice" | "ivr"
        public String language;   // BCP-47: "en-IN", "hi-IN", "ta-IN", "te-IN", "kn-IN"
        public int currentStep;   // 0 = not started, 1–10 = questions, 11 = complete
        public Map<String, String> collectedData = new LinkedHashMap<>();
        public String status;     // "active" | "completed" | "dropped"
        public String beneficiaryId = "";
        public String createdAt;

        // Ordered field keys matching Step 1–10
        public static final String[] FIELDS = {
            "name", "phone", "education", "familyOccupation", "currentLivelihood",
            "skills", "interests", "aspirations", "constraints", "employmentPreference", "region"
        };

        public BeneficiaryOnboardingSession(String sessionId, String mode, String language) {
            this.sessionId = sessionId;
            this.mode = mode;
            this.language = language;
            this.currentStep = 1;
            this.status = "active";
            this.createdAt = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(new java.util.Date());
        }

        /** Returns the field key for the current step (steps 1-10 map to indices 0-9). */
        public String currentFieldKey() {
            if (currentStep < 1 || currentStep > 10) return null;
            return FIELDS[currentStep - 1];
        }

        /** Store a value for the current step field and advance. */
        public void submitAndAdvance(String value) {
            String key = currentFieldKey();
            if (key != null) collectedData.put(key, value);
            currentStep++;
        }

        public boolean isComplete() { return currentStep > 10; }

        /** Serialize collectedData to a simple JSON string for DB storage. */
        public String collectedDataToJson() {
            StringBuilder sb = new StringBuilder("{");
            boolean first = true;
            for (Map.Entry<String, String> e : collectedData.entrySet()) {
                if (!first) sb.append(",");
                sb.append("\"").append(e.getKey()).append("\": \"").append(e.getValue().replace("\\", "\\\\").replace("\"", "\\\"")).append("\"");
                first = false;
            }
            sb.append("}");
            return sb.toString();
        }
    }

    // ========================================================================
    // LOCALIZED PROMPTS (5 LANGUAGES × 11 STRINGS)
    // ========================================================================

    /**
     * Returns the localized prompt string for a given step in a given language.
     * Index 0 = welcome message; indices 1–10 = registration questions.
     */
    public static class LocalizedPrompts {
        // Map: languageCode → String[11] (index 0: welcome, 1–10: field questions)
        private static final Map<String, String[]> PROMPTS = new LinkedHashMap<>();

        static {
            PROMPTS.put("en-IN", new String[]{
                "Welcome to Saathi! I will guide you through 10 quick questions to set up your livelihood profile. Let's begin.",
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
            });

            PROMPTS.put("hi-IN", new String[]{
                "साथी में आपका स्वागत है! मैं 10 सवालों के माध्यम से आपकी आजीविका प्रोफ़ाइल बनाऊँगा। चलिए शुरू करते हैं।",
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
            });

            PROMPTS.put("ta-IN", new String[]{
                "சாதிக்கு வருக! 10 கேள்விகள் மூலம் உங்கள் வாழ்வாதார சுயவிவரத்தை உருவாக்குகிறேன். தொடங்கலாம்.",
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
            });

            PROMPTS.put("te-IN", new String[]{
                "సాధి కి స్వాగతం! 10 ప్రశ్నల ద్వారా మీ జీవనోపాధి ప్రొఫైల్ తయారు చేస్తాను. మొదలుపెట్టండి.",
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
            });

            PROMPTS.put("kn-IN", new String[]{
                "ಸಾಥಿಗೆ ಸ್ವಾಗತ! 10 ಪ್ರಶ್ನೆಗಳ ಮೂಲಕ ನಿಮ್ಮ ಜೀವನೋಪಾಯ ಪ್ರೊಫೈಲ್ ರಚಿಸುತ್ತೇನೆ. ಪ್ರಾರಂಭಿಸೋಣ.",
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
            });
        }

        public static String getWelcome(String lang) {
            return getPrompts(lang)[0];
        }

        public static String getPrompt(String lang, int step) {
            String[] arr = getPrompts(lang);
            if (step < 1 || step >= arr.length) return arr[arr.length - 1];
            return arr[step];
        }

        private static String[] getPrompts(String lang) {
            return PROMPTS.getOrDefault(lang, PROMPTS.get("en-IN"));
        }
    }

    // ========================================================================
    // CONVERSATIONAL EXTRACTION SERVICE (Slot-filling / Normalisation)
    // ========================================================================

    /**
     * Extracts and normalises the user's spoken/typed answer for each registration step.
     * Returns null if the answer fails validation (e.g. invalid phone number).
     */
    public static class ConversationalExtractionService {

        /**
         * @param step  1–10 matching the registration question index
         * @param raw   raw text from the user
         * @return      normalised value string, or null if invalid
         */
        public static String extract(int step, String raw) {
            if (raw == null) return null;
            String trimmed = raw.trim();
            if (trimmed.isEmpty()) return null;

            return switch (step) {
                case 1 -> extractName(trimmed);              // Full Name
                case 2 -> extractPhone(trimmed);             // Phone Number
                case 3 -> extractEducation(trimmed);         // Education Level
                case 4 -> trimmed;                           // Family Occupation (free text)
                case 5 -> extractLivelihood(trimmed);        // Current Livelihood
                case 6 -> trimmed;                           // Skills & Hobbies (free text)
                case 7 -> trimmed;                           // Aspirations (free text)
                case 8 -> trimmed;                           // Constraints (free text)
                case 9 -> extractEmploymentPref(trimmed);    // Employment Preference
                case 10 -> trimmed;                          // Region (free text)
                default -> trimmed;
            };
        }

        /** Validate that the name is at least 2 chars and not purely numeric. */
        private static String extractName(String raw) {
            if (raw.length() < 2 || raw.matches("[0-9]+")) return null;
            return raw;
        }

        /** Validate Indian mobile: starts with 6-9, exactly 10 digits. */
        private static String extractPhone(String raw) {
            String digits = raw.replaceAll("[^0-9]", "");
            if (digits.length() == 10 && "6789".indexOf(digits.charAt(0)) >= 0) return digits;
            return null;
        }

        /** Normalise education level keywords with Indic support. */
        private static String extractEducation(String raw) {
            String lower = raw.toLowerCase();
            // 10th
            if (lower.contains("tenth") || lower.contains("10th") || lower.contains("sslc") || lower.contains("class 10")
                || lower.contains("10వ") || lower.contains("10ஆம்") || lower.contains("10वीं") || lower.contains("10ನೇ")) {
                return "10th Pass";
            }
            // 12th / Inter / +2 / PUC
            if (lower.contains("twelfth") || lower.contains("12th") || lower.contains("hsc") || lower.contains("class 12")
                || lower.contains("plus two") || lower.contains("+2") || lower.contains("inter") || lower.contains("puc")
                || lower.contains("12వ") || lower.contains("12ஆம்") || lower.contains("12वीं") || lower.contains("12ನೇ")) {
                return "12th Pass";
            }
            // Graduate / Degree
            if (lower.contains("graduate") || lower.contains("degree") || lower.contains("ba") || lower.contains("bsc")
                || lower.contains("bcom") || lower.contains("b.tech") || lower.contains("பட்டதாரி") || lower.contains("డిగ్రీ")
                || lower.contains("ग्रेजुएट") || lower.contains("పట్టభద్రుడు") || lower.contains("ಪದವೀಧರ")) {
                return "Graduate";
            }
            // ITI / Diploma / Polytechnic
            if (lower.contains("iti") || lower.contains("diploma") || lower.contains("polytechnic")
                || lower.contains("ఐటిఐ") || lower.contains("டிப்ளமோ") || lower.contains("आईटीआई") || lower.contains("ಐಟಿಐ")) {
                return "ITI";
            }
            // Illiterate / None
            if (lower.contains("illiterate") || lower.contains("none") || lower.contains("no education")
                || lower.contains("లేదు") || lower.contains("இல்லை") || lower.contains("नहीं") || lower.contains("ಇಲ್ಲ")) {
                return "Illiterate / None";
            }
            return raw;
        }

        /** Normalise common livelihood descriptions with Indic support. */
        private static String extractLivelihood(String raw) {
            String lower = raw.toLowerCase();
            if (lower.contains("unemploy") || lower.contains("no work") || lower.contains("ఖాలీ")
                || lower.contains("వేరే పని లేదు") || lower.contains("வேலையற்றவர்") || lower.contains("बेरोजगार") || lower.contains("ನಿರುದ್ಯೋಗಿ")) {
                return "Unemployed";
            }
            if (lower.contains("daily wage") || lower.contains("daily wager") || lower.contains("coolie")
                || lower.contains("కూలీ") || lower.contains("கூலி") || lower.contains("दैनिक मजदूर") || lower.contains("ದಿನಗೂಲಿ")) {
                return "Daily Wage Worker";
            }
            return raw;
        }

        /** Normalise employment preference with Indic support. */
        private static String extractEmploymentPref(String raw) {
            String lower = raw.toLowerCase();
            if (lower.contains("self") || lower.contains("own business") || lower.contains("entrepreneur")
                || lower.contains("స్వయం") || lower.contains("సొంత వ్యాపారం") || lower.contains("சுய") || lower.contains("स्वरोजगार") || lower.contains("ಸ್ವ-ಉದ್ಯೋಗ")) {
                return "Self Employment";
            }
            if (lower.contains("wage") || lower.contains("job") || lower.contains("salary")
                || lower.contains("ఉద్యోగం") || lower.contains("வேலை") || lower.contains("नौकरी") || lower.contains("वेतन") || lower.contains("ಕೆಲಸ")) {
                return "Wage Employment";
            }
            if (lower.contains("both") || lower.contains("రెండూ") || lower.contains("இரண்டும்") || lower.contains("दोनों") || lower.contains("ಎರಡೂ")) {
                return "Both";
            }
            return "Both";
        }
    }

    // ========================================================================
    // LOCALIZED PROFILE & FIELD LABELS DICTIONARY
    // ========================================================================

    public static class LocalizedProfileDictionary {
        private static final Map<String, Map<String, String>> DICT = new HashMap<>();

        static {
            // English
            Map<String, String> en = new HashMap<>();
            en.put("name", "Full Name");
            en.put("phone", "Mobile Phone");
            en.put("education", "Education Qualification");
            en.put("familyOccupation", "Family / Traditional Occupation");
            en.put("currentLivelihood", "Current Livelihood");
            en.put("skills", "Skills & Hobbies");
            en.put("interests", "Career Interests");
            en.put("aspirations", "Future Aspirations");
            en.put("constraints", "Mobility / Work Constraints");
            en.put("employmentPreference", "Employment Preference");
            en.put("region", "Region / District");
            en.put("status", "Pipeline Status");
            en.put("recommendedTraining", "Recommended PM-DAKSH / NBCFDC Training");
            en.put("recommendedJobs", "Recommended Livelihood Opportunities");
            DICT.put("en-IN", en);
            DICT.put("en", en);

            // Telugu (తెలుగు)
            Map<String, String> te = new HashMap<>();
            te.put("name", "పూర్తి పేరు");
            te.put("phone", "మొబైల్ ఫోన్ నంబర్");
            te.put("education", "విద్యార్హత");
            te.put("familyOccupation", "కుటుంబ / సాంప్రదాయ వృత్తి");
            te.put("currentLivelihood", "ప్రస్తుత జీవనోపాధి");
            te.put("skills", "నైపుణ్యాలు మరియు అభిరుచులు");
            te.put("interests", "ఆసక్తి ఉన్న రంగాలు");
            te.put("aspirations", "భవిష్యత్ లక్ష్యాలు / ఆశయాలు");
            te.put("constraints", "పని మరియు ప్రయాణ పరిమితులు");
            te.put("employmentPreference", "ఉపాధి ప్రాధాన్యత");
            te.put("region", "ప్రాంతం / జిల్లా");
            te.put("status", "పైప్‌లైన్ స్థితి");
            te.put("recommendedTraining", "సిఫార్సు చేయబడిన శిక్షణా కార్యక్రమాలు");
            te.put("recommendedJobs", "సిఫార్సు చేయబడిన జీవనోపాధి అవకాశాలు");
            DICT.put("te-IN", te);
            DICT.put("te", te);

            // Tamil (தமிழ்)
            Map<String, String> ta = new HashMap<>();
            ta.put("name", "முழு பெயர்");
            ta.put("phone", "மொபைல் எண்");
            ta.put("education", "கல்வித் தகுதி");
            ta.put("familyOccupation", "குடும்ப / பாரம்பரிய தொழில்");
            ta.put("currentLivelihood", "தற்போதைய வாழ்வாதாரம்");
            ta.put("skills", "திறன்கள் மற்றும் பொழுதுபோக்குகள்");
            ta.put("interests", "தொழில் ஆர்வங்கள்");
            ta.put("aspirations", "எதிர்கால ஆசைகள்");
            ta.put("constraints", "பயண / வேலை கட்டுப்பாடுகள்");
            ta.put("employmentPreference", "வேலை விருப்பம்");
            ta.put("region", "மாவட்டம் / பகுதி");
            ta.put("status", "செயல்முறை நிலை");
            ta.put("recommendedTraining", "பரிந்துரைக்கப்பட்ட பயிற்சி திட்டங்கள்");
            ta.put("recommendedJobs", "பரிந்துரைக்கப்பட்ட வாழ்வாதார வாய்ப்புகள்");
            DICT.put("ta-IN", ta);
            DICT.put("ta", ta);

            // Hindi (हिंदी)
            Map<String, String> hi = new HashMap<>();
            hi.put("name", "पूरा नाम");
            hi.put("phone", "मोबाइल नंबर");
            hi.put("education", "शैक्षणिक योग्यता");
            hi.put("familyOccupation", "पारिवारिक / पारंपरिक व्यवसाय");
            hi.put("currentLivelihood", "वर्तमान आजीविका");
            hi.put("skills", "कौशल और शौक");
            hi.put("interests", "रुचियां");
            hi.put("aspirations", "भविष्य की आकांक्षाएं");
            hi.put("constraints", "कार्य व आवागमन बाधाएं");
            hi.put("employmentPreference", "रोजगार प्राथमिकता");
            hi.put("region", "क्षेत्र / जिला");
            hi.put("status", "पाइपलाइन स्थिति");
            hi.put("recommendedTraining", "अनुशंसित प्रशिक्षण कार्यक्रम");
            hi.put("recommendedJobs", "अनुशंसित आजीविका अवसर");
            DICT.put("hi-IN", hi);
            DICT.put("hi", hi);

            // Kannada (ಕನ್ನಡ)
            Map<String, String> kn = new HashMap<>();
            kn.put("name", "ಪೂರ್ಣ ಹೆಸರು");
            kn.put("phone", "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ");
            kn.put("education", "ಶೈಕ್ಷಣಿಕ ವಿದ್ಯಾರ್ಹತೆ");
            kn.put("familyOccupation", "ಕುಟುಂಬದ / ಸಾಂಪ್ರದಾಯಿಕ ವೃತ್ತಿ");
            kn.put("currentLivelihood", "ಪ್ರಸ್ತುತ ಜೀವನೋಪಾಯ");
            kn.put("skills", "ಕೌಶಲ್ಯಗಳು ಮತ್ತು ಹವ್ಯಾಸಗಳು");
            kn.put("interests", "ಆಸಕ್ತಿಗಳು");
            kn.put("aspirations", "ಭವಿಷ್ಯದ ಆಕಾಂಕ್ಷೆಗಳು");
            kn.put("constraints", "ಕೆಲಸ ಮತ್ತು ಚಲನ ನಿರ್ಬಂಧಗಳು");
            kn.put("employmentPreference", "ಉದ್ಯೋಗ ಆದ್ಯತೆ");
            kn.put("region", "ಪ್ರದೇಶ / ಜಿಲ್ಲೆ");
            kn.put("status", "ಪೈಪ್‌ಲೈನ್ ಸ್ಥಿತಿ");
            kn.put("recommendedTraining", "ಶಿಫಾರಸು ಮಾಡಿದ ತರಬೇತಿ ಕಾರ್ಯಕ್ರಮಗಳು");
            kn.put("recommendedJobs", "ಶಿಫಾರಸು ಮಾಡಿದ ಜೀವನೋಪಾಯ ಅವಕಾಶಗಳು");
            DICT.put("kn-IN", kn);
            DICT.put("kn", kn);
        }

        public static Map<String, String> getLabels(String lang) {
            if (lang == null) return DICT.get("en-IN");
            for (String key : DICT.keySet()) {
                if (key.equalsIgnoreCase(lang) || lang.startsWith(key)) {
                    return DICT.get(key);
                }
            }
            return DICT.get("en-IN");
        }
    }

    // ========================================================================
    // ENV LOADER — reads GEMINI_API_KEY from .env file in the working directory
    // ========================================================================

    /**
     * Reads key=value pairs from a .env file in the current working directory.
     * Falls back to System.getenv() if the file doesn't exist or key is missing.
     */
    public static class EnvLoader {
        private static final Map<String, String> ENV_CACHE = new HashMap<>();
        private static volatile boolean loaded = false;

        public static synchronized String get(String key) {
            if (!loaded) load();
            String val = ENV_CACHE.get(key);
            if (val != null && !val.isBlank()) return val;
            // Fallback to real environment variable
            return System.getenv(key);
        }

        private static void load() {
            loaded = true;
            File envFile = new File(".env");
            if (!envFile.exists()) {
                System.out.println("[EnvLoader] .env file not found in " + new File(".").getAbsolutePath());
                return;
            }
            try (BufferedReader br = new BufferedReader(new FileReader(envFile, StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) continue;
                    int eq = line.indexOf('=');
                    if (eq < 1) continue;
                    String k = line.substring(0, eq).trim();
                    String v = line.substring(eq + 1).trim();
                    // Strip surrounding quotes if present
                    if (v.length() >= 2 &&
                        ((v.startsWith("\"") && v.endsWith("\"")) ||
                         (v.startsWith("'") && v.endsWith("'")))) {
                        v = v.substring(1, v.length() - 1);
                    }
                    ENV_CACHE.put(k, v);
                    System.out.println("[EnvLoader] Loaded key: " + k);
                }
            } catch (IOException e) {
                System.err.println("[EnvLoader] Failed to read .env: " + e.getMessage());
            }
        }
    }

    // ========================================================================
    // AI SERVICE ABSTRACTION — Gemini-backed TTS & STT
    // ========================================================================

    private static final HttpClient AI_HTTP_CLIENT = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(15))
        .build();

    /**
     * SpeechToTextService — uses Gemini multimodal (gemini-3.6-flash) to transcribe audio.
     * Sends base64-encoded audio inline. Falls back to stub message on error.
     */
    public static class SpeechToTextService {
        private static final String STT_MODEL = "gemini-3.5-flash";
        private static final String STT_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/" + STT_MODEL + ":generateContent";

        public static String transcribe(byte[] audioBytes, String languageCode) {
            String apiKey = EnvLoader.get("GEMINI_API_KEY");
            if (apiKey == null || apiKey.isBlank()) {
                System.err.println("[STT] GEMINI_API_KEY not set — returning stub.");
                return "[STT] Audio received (" + audioBytes.length + " bytes). API key not configured.";
            }

            try {
                String base64Audio = Base64.getEncoder().encodeToString(audioBytes);
                // Detect MIME type from bytes (WebM starts with 0x1A45DFA3)
                String mimeType = (audioBytes.length > 4 &&
                    audioBytes[0] == 0x1A && audioBytes[1] == 0x45) ? "audio/webm" : "audio/wav";

                String langHint = languageCode != null ? "Transcribe in language " + languageCode + ". " : "";
                String transcribePrompt = langHint + "Please transcribe this audio accurately. Return only the transcribed text.";
                String requestBody = "{" +
                    "\"contents\":[{\"role\":\"user\",\"parts\":[" +
                    "{\"text\":\"" + jeS(transcribePrompt) + "\"}," +
                    "{\"inline_data\":{\"mime_type\":\"" + mimeType + "\",\"data\":\"" + base64Audio + "\"}}" +
                    "]}]," +
                    "\"generationConfig\":{\"maxOutputTokens\":512,\"temperature\":0.0}}";

                HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(STT_URL + "?key=" + apiKey))
                    .header("Content-Type", "application/json; charset=utf-8")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                    .build();

                HttpResponse<String> response =
                    AI_HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

                if (response.statusCode() == 200) {
                    String transcript = extractGeminiText(response.body());
                    if (transcript != null && !transcript.isBlank()) {
                        System.out.println("[STT] ✓ Transcribed: " + transcript.substring(0, Math.min(80, transcript.length())));
                        return transcript.trim();
                    }
                } else {
                    System.err.println("[STT] API error HTTP " + response.statusCode() + ": " + response.body());
                }
            } catch (IOException | InterruptedException e) {
                System.err.println("[STT] Request failed: " + e.getMessage());
                Thread.currentThread().interrupt();
            }
            return "[STT] Transcription failed. Please try again.";
        }

        private static String extractGeminiText(String json) {
            if (json == null) return null;
            int ti = json.indexOf("\"text\":");
            if (ti < 0) return null;
            int start = json.indexOf('"', ti + 7) + 1;
            if (start <= 0) return null;
            StringBuilder result = new StringBuilder();
            boolean esc = false;
            for (int i = start; i < json.length(); i++) {
                char c = json.charAt(i);
                if (esc) {
                    switch (c) {
                        case '"' -> result.append('"');
                        case '\\' -> result.append('\\');
                        case 'n' -> result.append('\n');
                        case 'r' -> result.append('\r');
                        case 't' -> result.append('\t');
                        default  -> { result.append('\\'); result.append(c); }
                    }
                    esc = false;
                } else if (c == '\\') {
                    esc = true;
                } else if (c == '"') {
                    break;
                } else {
                    result.append(c);
                }
            }
            return result.toString();
        }

        private static String jeS(String s) {
            if (s == null) return "";
            return s.replace("\\", "\\\\").replace("\"", "\\\"")
                    .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
        }
    }

    /**
     * TextToSpeechService — uses Gemini TTS (gemini-2.5-flash-preview-tts) to generate speech.
     * This is the ONLY Gemini model that supports responseModalities=["AUDIO"].
     * Returns a JSON object with either a base64 audio payload (for inline playback)
     * or falls back to browser Web Speech API hint when the key is unavailable.
     */
    public static class TextToSpeechService {

        public static String synthesize(String text, String languageCode) {
            if (text == null || text.isBlank()) return buildBrowserFallback(text, languageCode);

            String l = (languageCode != null ? languageCode.toLowerCase() : "en-in");
            String tl = l.startsWith("te") ? "te"
                      : l.startsWith("ta") ? "ta"
                      : l.startsWith("hi") ? "hi"
                      : l.startsWith("kn") ? "kn"
                      : "en-IN";

            try {
                String clean = text
                    .replaceAll("[*_#`~\\[\\]()]", " ")
                    .replaceAll("[\\p{So}\\p{Cn}]", "")
                    .replaceAll("\\s+", " ")
                    .trim();

                List<String> chunks = splitText(clean, 140);
                ByteArrayOutputStream mp3Stream = new ByteArrayOutputStream();

                for (String chunk : chunks) {
                    if (chunk.isBlank()) continue;
                    String encoded = java.net.URLEncoder.encode(chunk, StandardCharsets.UTF_8);
                    String url = "https://translate.google.com/translate_tts?ie=UTF-8&tl=" + tl + "&client=tw-ob&q=" + encoded;

                    HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                        .timeout(Duration.ofSeconds(4))
                        .GET()
                        .build();

                    HttpResponse<byte[]> res = AI_HTTP_CLIENT.send(req, HttpResponse.BodyHandlers.ofByteArray());
                    if (res.statusCode() == 200 && res.body() != null && res.body().length > 0) {
                        mp3Stream.write(res.body());
                    }
                }

                if (mp3Stream.size() > 0) {
                    String b64 = Base64.getEncoder().encodeToString(mp3Stream.toByteArray());
                    String safeText = jeS(text);
                    return "{\"text\":\"" + safeText + "\",\"lang\":\"" + languageCode +
                           "\",\"engine\":\"native-studio-tts\",\"audio\":\"" + b64 + "\"}";
                }
            } catch (Exception e) {
                System.err.println("[TTS] Native synthesis error: " + e.getMessage());
            }

            return buildBrowserFallback(text, languageCode);
        }

        private static List<String> splitText(String text, int maxLen) {
            List<String> chunks = new ArrayList<>();
            if (text.length() <= maxLen) {
                chunks.add(text);
                return chunks;
            }
            String[] sentences = text.split("(?<=[.!?।॥,\\n])\\s+");
            StringBuilder cur = new StringBuilder();
            for (String s : sentences) {
                if (cur.length() + s.length() > maxLen && cur.length() > 0) {
                    chunks.add(cur.toString().trim());
                    cur.setLength(0);
                }
                cur.append(s).append(" ");
            }
            if (cur.length() > 0) chunks.add(cur.toString().trim());
            return chunks;
        }

        private static String buildBrowserFallback(String text, String languageCode) {
            String safeText = jeS(text);
            return "{\"text\":\"" + safeText + "\",\"lang\":\"" + (languageCode != null ? languageCode : "en-IN") + "\",\"engine\":\"browser-tts\"}";
        }

        private static String jeS(String s) {
            if (s == null) return "";
            return s.replace("\\", "\\\\").replace("\"", "\\\"")
                    .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t");
        }
    }
}
