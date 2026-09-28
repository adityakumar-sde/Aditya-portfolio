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
            )
        );

        songRepository.saveAll(library);
    }
}