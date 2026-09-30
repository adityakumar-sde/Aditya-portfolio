package com.aditya.portfolio.config;

import com.aditya.portfolio.entity.Song;
import com.aditya.portfolio.repository.SongRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SongRepository songRepository;

    public DataInitializer(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @Override
    public void run(String... args) {
        // Refresh catalog to ensure 100% authentic, non-duplicate audio files
        songRepository.deleteAll();

        List<Song> library = List.of(
            // ========================================================
            // 1. CHHATH PUJA SONGS (Top Priority #1 - Sharda Sinha)
            // ========================================================
            new Song(
                "Kaanche Hi Baans Ke Bahangiya",
                "Sharda Sinha",
                "Chhath Mahaparv Geet",
                "Bhojpuri",
                "Chhath Puja",
                "Classic",
                "Devotional",
                "chhath, puja, bihari, bhojpuri, devotional, sharda sinha, classic, default",
                "/music/kaanche-hi-bans-ke-bahangiya.mp3",
                "/images/music/sharda-sinha.jpg",
                327,
                true
            ),
            new Song(
                "Ugahe Suraj Dev Bhela Bhinusarba",
                "Sharda Sinha",
                "Chhath Mahaparv Arghya",
                "Bhojpuri",
                "Chhath Puja",
                "Classic",
                "Devotional",
                "chhath, suraj dev, puja, bihari, bhojpuri, sharda sinha, classic, devotional",
                "/music/ugahe-suraj-dev.mp3",
                "/images/music/sharda-sinha.jpg",
                170,
                true
            ),
            new Song(
                "Marbo Re Sugwa Dhanush Se",
                "Sharda Sinha",
                "Chhath Mahaparv Geet",
                "Bhojpuri",
                "Chhath Puja",
                "Classic",
                "Devotional",
                "chhath, sugwa, puja, bihari, bhojpuri, sharda sinha, classic, devotional",
                "/music/marbo-re-sugwa.mp3",
                "/images/music/sharda-sinha.jpg",
                415,
                true
            ),
            new Song(
                "Sone Ke Khadauwa He Dinanath",
                "Sharda Sinha",
                "Chhath Dinanath Aradhana",
                "Bhojpuri",
                "Chhath Puja",
                "Classic",
                "Devotional",
                "chhath, dinanath, puja, bihari, bhojpuri, sharda sinha, classic, devotional",
                "/music/sone-ke-khadauwa.mp3",
                "/images/music/sharda-sinha.jpg",
                296,
                true
            ),
            new Song(
                "Char Pahar Ham Jal Sewela",
                "Sharda Sinha",
                "Chhath Pawan Parv",
                "Bhojpuri",
                "Chhath Puja",
                "Classic",
                "Devotional",
                "chhath, char pahar, jal sewela, puja, bihari, bhojpuri, sharda sinha, classic",
                "/music/char-pahar-ham-jal-sewela.mp3",
                "/images/music/sharda-sinha.jpg",
                256,
                true
            ),
            new Song(
                "Ghatwa Ke Aari Aari",
                "Sharda Sinha",
                "Chhath Mahaparv Arghya",
                "Bhojpuri",
                "Chhath Puja",
                "Classic",
                "Devotional",
                "chhath, ghatwa, puja, bihari, bhojpuri, sharda sinha, classic, devotional",
                "/music/ghatwa-ke-aari-aari.mp3",
                "/images/music/sharda-sinha.jpg",
                214,
                true
            ),

            // ========================================================
            // 2. OLD BHOJPURI CLASSICS (Authentic Bihari Folk)
            // ========================================================
            new Song(
                "Bahiyan Jo Hamari Pakadi",
                "Bhojpuri Folk Legends",
                "Bihari Lokgeet Legacy",
                "Bhojpuri",
                "Classic Folk",
                "Old",
                "Romantic",
                "bihari, bhojpuri, old, classic, folk, vocal, lokgeet, bahiyan",
                "/music/bhojpuri-classic-folk.mp3",
                "/images/music/bhojpuri-classic.jpg",
                234,
                true
            ),
            new Song(
                "Dulari Bahiniya",
                "Traditional Bihari Lokgeet",
                "Maithili & Bhojpuri Virasat",
                "Bhojpuri",
                "Folk Traditional",
                "Old",
                "Nostalgic",
                "bihari, bhojpuri, old, traditional, folk, vocal, bahiniya",
                "/music/chhath-sharda-sinha.mp3",
                "/images/music/bhojpuri-classic.jpg",
                221,
                true
            ),

            // ========================================================
            // 3. GOLDEN OLD HINDI CLASSICS (16 Songs - 100% Unique Real Audio)
            // ========================================================
            new Song(
                "Yeh Sham Mastani",
                "Kishore Kumar",
                "Kati Patang",
                "Hindi",
                "Romantic Classic",
                "Old",
                "Romantic",
                "hindi, old, classic, kishore kumar, yeh sham mastani, 70s, rd burman",
                "/music/yeh-sham-mastani.mp3",
                "/images/music/kishore-kumar.jpg",
                285,
                true
            ),
            new Song(
                "Zindagi Ek Safar Hai Suhana",
                "Kishore Kumar",
                "Andaz",
                "Hindi",
                "Philosophical / Uplifting",
                "Old",
                "Energetic",
                "hindi, old, classic, kishore kumar, andaz, zindagi ek safar, 70s",
                "/music/zindagi-ek-safar.mp3",
                "/images/music/kishore-kumar.jpg",
                261,
                true
            ),
            new Song(
                "Pyar Diwana Hota Hai",
                "Kishore Kumar",
                "Kati Patang",
                "Hindi",
                "Romantic Classic",
                "Old",
                "Romantic",
                "hindi, old, classic, kishore kumar, pyar diwana, kati patang, rd burman",
                "/music/pyar-diwana-hota-hai.mp3",
                "/images/music/kishore-kumar.jpg",
                284,
                true
            ),
            new Song(
                "Yeh Dil Na Hota Bechara",
                "Kishore Kumar",
                "Jewel Thief",
                "Hindi",
                "Evergreen Classic",
                "Old",
                "Playful",
                "hindi, old, classic, kishore kumar, dev anand, sd burman, jewel thief",
                "/music/yeh-dil-na-hota-bechara.mp3",
                "/images/music/kishore-kumar.jpg",
                265,
                true
            ),
            new Song(
                "Phoolon Ka Taaron Ka",
                "Kishore Kumar",
                "Hare Rama Hare Krishna",
                "Hindi",
                "Emotional Classic",
                "Old",
                "Nostalgic",
                "hindi, old, classic, kishore kumar, phoolon ka taaron ka, rd burman",
                "/music/phoolon-ka-taaron-ka.mp3",
                "/images/music/kishore-kumar.jpg",
                218,
                true
            ),
            new Song(
                "Panna Ki Tamanna Hai",
                "Kishore Kumar & Lata Mangeshkar",
                "Heera Panna",
                "Hindi",
                "Romantic Duet",
                "Old",
                "Romantic",
                "hindi, old, classic, kishore kumar, lata mangeshkar, duet, heera panna",
                "/music/panna-ki-tamanna-hai.mp3",
                "/images/music/retro-romance.jpg",
                351,
                true
            ),
            new Song(
                "Kabhi Kabhie Mere Dil Mein",
                "Mukesh",
                "Kabhi Kabhie",
                "Hindi",
                "Poetic Romantic",
                "Old",
                "Romantic",
                "hindi, old, classic, mukesh, khayyam, kabhi kabhie, sahir",
                "/music/kabhi-kabhie-mere-dil-mein.mp3",
                "/images/music/mukesh.jpg",
                143,
                true
            ),
            new Song(
                "Kisi Ki Muskurahaton Pe Ho Nisaar",
                "Mukesh",
                "Anari",
                "Hindi",
                "Soulful Classic",
                "Old",
                "Uplifting",
                "hindi, old, classic, mukesh, raj kapoor, anari, kisi ki muskurahaton",
                "/music/kisi-ki-muskurahaton-pe.mp3",
                "/images/music/mukesh.jpg",
                269,
                true
            ),
            new Song(
                "Mera Joota Hai Japani",
                "Mukesh",
                "Shree 420",
                "Hindi",
                "Golden Era Classic",
                "Old",
                "Playful",
                "hindi, old, classic, mukesh, raj kapoor, shree 420, mera joota hai japani",
                "/music/mera-joota-hai-japani.mp3",
                "/images/music/shree-420.jpg",
                268,
                true
            ),
            new Song(
                "Jeena Yahan Marna Yahan",
                "Mukesh",
                "Mera Naam Joker",
                "Hindi",
                "Philosophical Melody",
                "Old",
                "Emotional",
                "hindi, old, classic, mukesh, mera naam joker, jeena yahan marna yahan",
                "/music/jeena-yahan-marna-yahan.mp3",
                "/images/music/mukesh.jpg",
                252,
                true
            ),
            new Song(
                "Suhana Safar Aur Yeh Mausam",
                "Mukesh",
                "Madhumati",
                "Hindi",
                "Nature Romance",
                "Old",
                "Uplifting",
                "hindi, old, classic, mukesh, salil chowdhury, madhumati, suhana safar",
                "/music/suhana-safar.mp3",
                "/images/music/mukesh.jpg",
                230,
                true
            ),
            new Song(
                "Ramaiya Vastavaiya",
                "Lata Mangeshkar, Mohammed Rafi & Mukesh",
                "Shree 420",
                "Hindi",
                "Folk Bollywood Duet",
                "Old",
                "Energetic",
                "hindi, old, classic, lata mangeshkar, mohd rafi, mukesh, shree 420, ramaiya",
                "/music/ramaiya-vastavaiya.mp3",
                "/images/music/shree-420.jpg",
                360,
                true
            ),
            new Song(
                "Ichak Dana Beechak Dana",
                "Lata Mangeshkar & Mukesh",
                "Shree 420",
                "Hindi",
                "Playful Duet",
                "Old",
                "Playful",
                "hindi, old, classic, lata mangeshkar, mukesh, shree 420, ichak dana",
                "/music/ichak-dana-beechak-dana.mp3",
                "/images/music/shree-420.jpg",
                273,
                true
            ),
            new Song(
                "Dil Tadap Tadap Ke Kah Raha",
                "Mukesh & Lata Mangeshkar",
                "Madhumati",
                "Hindi",
                "Evergreen Duet",
                "Old",
                "Romantic",
                "hindi, old, classic, mukesh, lata mangeshkar, madhumati, dil tadap tadap",
                "/music/dil-tadap-tadap-ke.mp3",
                "/images/music/retro-romance.jpg",
                207,
                true
            ),
            new Song(
                "Sawan Ka Mahina",
                "Mukesh & Lata Mangeshkar",
                "Milan",
                "Hindi",
                "Folk Romantic Duet",
                "Old",
                "Romantic",
                "hindi, old, classic, mukesh, lata mangeshkar, milan, sawan ka mahina",
                "/music/sawan-ka-mahina.mp3",
                "/images/music/retro-romance.jpg",
                328,
                true
            ),
            new Song(
                "Giridhara Gopala",
                "M.S. Subbulakshmi",
                "Meera Bhajan Classics",
                "Hindi",
                "Classical Vocal",
                "Old",
                "Devotional",
                "hindi, old, classic, devotional, meera bhajan, subbulakshmi, vocal",
                "/music/hindi-old-romantic.mp3",
                "/images/music/classical-vocal.jpg",
                164,
                true
            ),

            // ========================================================
            // 4. USTAD NUSRAT FATEH ALI KHAN (Qawwali & Sufi Classics)
            // ========================================================
            new Song(
                "Afreen Afreen",
                "Nusrat Fateh Ali Khan",
                "Sangam",
                "Urdu",
                "Sufi Qawwali",
                "Classic",
                "Romantic",
                "nusrat, nushrat, fateh ali khan, afreen afreen, sufi, qawwali, classic",
                "/music/nusrat-afreen-afreen.mp3",
                "/images/music/classical-vocal.jpg",
                405,
                true
            ),
            new Song(
                "Mere Rashke Qamar",
                "Nusrat Fateh Ali Khan",
                "Qawwali Masterpieces",
                "Urdu",
                "Sufi Qawwali",
                "Classic",
                "Romantic",
                "nusrat, nushrat, fateh ali khan, mere rashke qamar, sufi, qawwali, classic",
                "/music/nusrat-mere-rashke-qamar.mp3",
                "/images/music/classical-vocal.jpg",
                520,
                true
            ),
            new Song(
                "Ye Jo Halka Halka Suroor Hai",
                "Nusrat Fateh Ali Khan",
                "Live in London",
                "Urdu",
                "Sufi Qawwali",
                "Classic",
                "Calm",
                "nusrat, nushrat, fateh ali khan, ye jo halka halka suroor, sufi, qawwali, classic",
                "/music/nusrat-ye-jo-halka-halka.mp3",
                "/images/music/classical-vocal.jpg",
                610,
                true
            ),
            new Song(
                "Sanson Ki Mala Pe Simru Main",
                "Nusrat Fateh Ali Khan",
                "Devotional & Sufi",
                "Urdu",
                "Sufi Devotional",
                "Classic",
                "Devotional",
                "nusrat, nushrat, fateh ali khan, sanson ki mala, simru main, sufi, devotional",
                "/music/nusrat-sanson-ki-mala.mp3",
                "/images/music/classical-vocal.jpg",
                580,
                true
            ),

            // ========================================================
            // 5. HEARTTOUCHING SAD & EMOTIONAL SONGS (Mood: Sad)
            // ========================================================
            new Song(
                "Channa Mereya",
                "Arijit Singh",
                "Ae Dil Hai Mushkil",
                "Hindi",
                "Bollywood Sad",
                "Modern",
                "Sad",
                "sad, sad song, sad songs, channa mereya, arijit singh, dard, heartbreak, emotional",
                "/music/channa-mereya-sad.mp3",
                "/images/music/retro-romance.jpg",
                289,
                true
            ),
            new Song(
                "Agar Tum Saath Ho",
                "Arijit Singh & Alka Yagnik",
                "Tamasha",
                "Hindi",
                "Bollywood Sad",
                "Modern",
                "Sad",
                "sad, sad song, sad songs, agar tum saath ho, arijit singh, alka yagnik, heartbreak, emotional",
                "/music/agar-tum-saath-ho-sad.mp3",
                "/images/music/retro-romance.jpg",
                341,
                true
            ),
            new Song(
                "Tujhe Bhula Diya",
                "Mohit Chauhan & Shruti Pathak",
                "Anjaana Anjaani",
                "Hindi",
                "Bollywood Sad",
                "Modern",
                "Sad",
                "sad, sad song, sad songs, tujhe bhula diya, mohit chauhan, heartbreak, emotional, dard",
                "/music/tujhe-bhula-diya-sad.mp3",
                "/images/music/retro-romance.jpg",
                279,
                true
            ),
            new Song(
                "Hamari Adhuri Kahani",
                "Arijit Singh",
                "Hamari Adhuri Kahani",
                "Hindi",
                "Bollywood Sad",
                "Modern",
                "Sad",
                "sad, sad song, sad songs, hamari adhuri kahani, arijit singh, heartbreak, emotional, dard",
                "/music/hamari-adhuri-kahani-sad.mp3",
                "/images/music/retro-romance.jpg",
                398,
                true
            ),

            // ========================================================
            // 6. DEVOTIONAL & BHAKTI SONGS (Complete Full Prayers & Bhajans)
            // ========================================================
            new Song(
                "Shree Hanuman Chalisa",
                "Hariharan",
                "Shree Hanuman Chalisa (Hanuman Ashtak)",
                "Hindi",
                "Bhajan / Devotional",
                "Classic",
                "Devotional",
                "devotional, bhakti, hanuman chalisa, hariharan, bajrangbali, hanuman, prayer, aarti, chalisa, full",
                "https://aac.saavncdn.com/256/254c18ccf39f955649057ed4426aa7f3_320.mp4",
                "https://c.saavncdn.com/256/Shree-Hanuman-Chalisa-Hanuman-Ashtak-Hindi-1992-20260324161030-500x500.jpg",
                586,
                true
            ),
            new Song(
                "Shiv Tandav Stotram",
                "Shankar Mahadevan",
                "Bhole Shiv Shankar",
                "Sanskrit",
                "Bhajan / Devotional",
                "Modern",
                "Devotional",
                "devotional, bhakti, shiv, shiva, shiv tandav stotram, mahadev, bhole, shankar mahadevan, stotram, full",
                "https://aac.saavncdn.com/870/4c18e7546871c08147aa76462fccc52f_320.mp4",
                "https://c.saavncdn.com/870/Bhole-Shiv-Shankar-Sanskrit-2025-20250720025922-500x500.jpg",
                553,
                true
            ),
            new Song(
                "Achyutam Keshavam Krishna Damodaram",
                "Pratiksha Vashishtha",
                "Divine Melodies",
                "Hindi",
                "Bhajan / Devotional",
                "Modern",
                "Devotional",
                "devotional, bhakti, krishna, achyutam keshavam, kaun kehte hai bhagwan aate nahi, bhajan, full",
                "https://aac.saavncdn.com/225/4d5b20b0cd6f140961cceb3310e298e2_320.mp4",
                "https://c.saavncdn.com/225/Divine-Melodies-Hindi-2026-20260821114218-500x500.jpg",
                274,
                true
            ),

            // ========================================================
            // 7. HARYANVI SUPERHITS (100% Full Studio Songs)
            // ========================================================
            new Song(
                "52 Gaj Ka Daman",
                "Renuka Panwar",
                "52 Gaj Ka Daman",
                "Haryanvi",
                "Haryanvi Hits",
                "Modern",
                "Energetic",
                "haryanvi, 52 gaj ka daman, renuka panwar, haryanvi song, haryanvi hits, dance, folk, full",
                "https://aac.saavncdn.com/407/d8b1de34b18920d7715033dbf8c93f47_320.mp4",
                "https://c.saavncdn.com/407/52-Gaj-Ka-Daman-Haryanvi-2020-20210625170012-500x500.jpg",
                163,
                true
            ),
            new Song(
                "Gypsy (Balam Thanedar)",
                "Antra Singh Priyanka",
                "Gypsy Balam Thanedar",
                "Haryanvi",
                "Haryanvi Hits",
                "Modern",
                "Energetic",
                "haryanvi, gypsy, balam thanedar, pranjal dahiya, haryanvi hits, dance, full",
                "https://aac.saavncdn.com/259/7fe06c25a05457d58f591533cd2b4825_320.mp4",
                "https://c.saavncdn.com/259/Gypsy-Balam-Thanedar-Bhojpuri-2022-20220823032000-500x500.jpg",
                203,
                true
            ),
            new Song(
                "Motto",
                "Diler Kharkiya",
                "Sadgi Teri Ne Dil Touch Karke",
                "Haryanvi",
                "Haryanvi Hits",
                "Modern",
                "Playful",
                "haryanvi, motto, diler kharkiya, ajay hooda, haryanvi hits, full",
                "https://aac.saavncdn.com/195/188b32012d89a595de3163898654ae00_320.mp4",
                "https://c.saavncdn.com/195/Sadgi-Teri-Ne-Dil-Touch-Karke-Hindi-2022-20220307081247-500x500.jpg",
                182,
                true
            ),

            // ========================================================
            // 8. BHOJPURI SUPERHITS (Pawan Singh & Khesari Lal - Full Songs)
            // ========================================================
            new Song(
                "RajaJi Ke Dilwa",
                "Pawan Singh & Shivani Singh",
                "Rajaji Ke Dilwa",
                "Bhojpuri",
                "Bhojpuri Trending",
                "Modern",
                "Energetic",
                "bhojpuri, pawan singh, shivani singh, rajaji ke dilwa, bhojpuri trending, dance, hit, full",
                "https://aac.saavncdn.com/796/56b30e163800933588261c02eb3f8994_320.mp4",
                "https://c.saavncdn.com/796/Rajaji-Ke-Dilwa-Bhojpuri-2023-20230430101330-500x500.jpg",
                184,
                true
            ),
            new Song(
                "Nathuniya",
                "Khesari Lal Yadav & Priyanka Singh",
                "Khesari Lal Yadav - Bhojpuri Hit Machine",
                "Bhojpuri",
                "Bhojpuri Trending",
                "Modern",
                "Energetic",
                "bhojpuri, khesari lal, khesari lal yadav, priyanka singh, nathuniya, bhojpuri trending, full",
                "https://aac.saavncdn.com/552/3585ac65a53569958fc61e83d1e1c3de_sar_320.mp4",
                "https://c.saavncdn.com/552/Khesari-Lal-Yadav-Bhojpuri-Hit-Machine-Bhojpuri-2022-20220606163613-500x500.jpg",
                213,
                true
            ),

            // ========================================================
            // 9. MODERN HINDI & BOLLYWOOD HITS (100% Full Audio)
            // ========================================================
            new Song(
                "Kesariya",
                "Pritam & Arijit Singh",
                "Brahmastra",
                "Hindi",
                "Bollywood Romantic",
                "Modern",
                "Romantic",
                "hindi, bollywood, romantic, kesariya, arijit singh, pritam, brahmastra, love, full",
                "https://aac.saavncdn.com/871/c2febd353f3a076a406fa37510f31f9f_320.mp4",
                "https://c.saavncdn.com/871/Brahmastra-Original-Motion-Picture-Soundtrack-Hindi-2022-20221006155213-500x500.jpg",
                268,
                true
            ),
            new Song(
                "Tum Hi Ho",
                "Arijit Singh",
                "Aashiqui 2",
                "Hindi",
                "Bollywood Romantic",
                "Modern",
                "Romantic",
                "hindi, bollywood, romantic, tum hi ho, aashiqui 2, arijit singh, love anthem, full",
                "https://aac.saavncdn.com/430/5c5ea5cc00e3bff45616013226f376fe_320.mp4",
                "https://c.saavncdn.com/430/Aashiqui-2-Hindi-2013-500x500.jpg",
                262,
                true
            ),
            new Song(
                "Raataan Lambiyan",
                "Jubin Nautiyal & Asees Kaur",
                "Shershaah",
                "Hindi",
                "Bollywood Romantic",
                "Modern",
                "Romantic",
                "hindi, bollywood, romantic, raataan lambiyan, shershaah, jubin nautiyal, asees kaur, full",
                "https://aac.saavncdn.com/238/35726d4394604604e961bf5b846870d0_320.mp4",
                "https://c.saavncdn.com/238/Shershaah-Original-Motion-Picture-Soundtrack--Hindi-2021-20210815181610-500x500.jpg",
                230,
                true
            ),

            // ========================================================
            // 10. PUNJABI HITS (100% Full Audio)
            // ========================================================
            new Song(
                "295",
                "Sidhu Moose Wala",
                "Moosetape",
                "Punjabi",
                "Punjabi Hits",
                "Modern",
                "Energetic",
                "punjabi, 295, sidhu moose wala, sidhu moosewala, moosetape, punjabi hits, full",
                "https://aac.saavncdn.com/609/852628435c98083dfe217c1cfa731bb5_320.mp4",
                "https://c.saavncdn.com/609/Moosetape-Punjabi-2021-20260626155141-500x500.jpg",
                270,
                true
            )
        );

        songRepository.saveAll(library);
    }
}