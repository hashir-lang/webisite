<?php
/**
 * Curated programme list used by the automated "updates" emails
 * (welcome overview + one-course-per-day drip). Kept in PHP so the mail
 * cron is fully self-contained on the server and does not depend on the
 * compiled React catalogue.
 *
 * Each slug matches a real /programmes/<slug> page on the live site, so the
 * "View programme" button links straight to it.
 */

/** Public base URL of the site (used to build absolute links in emails). */
function ue_site_base(): string
{
    return rtrim((string) ue_env('SITE_BASE_URL', 'https://uecampus.com'), '/');
}

/**
 * The ordered campaign: subscribers receive one of these every other day, in
 * order. It opens with the flagship DBA, then walks through the Walsh
 * "Fast track" dual-award programmes (UK Qualifi diploma + US degree = two
 * qualifications), and finishes with standalone Qualifi diplomas.
 *
 * @return array<int, array{
 *   slug:string, title:string, level:string, duration:string,
 *   blurb:string, detail:string, highlights:array<int,string>
 * }>
 */
function ue_drip_courses(): array
{
    return [
        [
            'slug' => 'dba-walsh',
            'title' => 'Doctor of Business Administration (DBA)',
            'level' => 'Doctorate · Walsh College (USA)',
            'duration' => '3 years',
            'blurb' => 'The pinnacle of business qualifications, ranked #1 Online DBA by Forbes (2024).',
            'detail' => 'The Doctor of Business Administration from Walsh College is built for senior professionals who want to lead at the highest level and carry out original, applied research. You study 100% online around your career, with expert supervision, and graduate with a regionally accredited US doctorate recognised around the world.',
            'highlights' => [
                'Ranked #1 Online DBA by Forbes (2024)',
                '100% online, keep working while you study',
                'Regionally accredited US institution (HLC · ACBSP)',
                'Complete in around 3 years',
            ],
        ],
        [
            'slug' => 'mba-general-management-walsh-uecampus',
            'title' => 'MBA, Dual Award (UK Diploma + US MBA)',
            'level' => "Master's · Fast track · Dual Award",
            'duration' => '1 year',
            'blurb' => 'Two qualifications in one fast year: a UK Qualifi Level 7 diploma AND a US MBA.',
            'detail' => 'This is a dual-award pathway, so you graduate with TWO globally recognised qualifications. First you complete an Ofqual-regulated UK Qualifi Level 7 Diploma in Strategic Management and Leadership, then you top it up with an MBA from Forbes-ranked Walsh College in the USA, all fully online, in as little as one year.',
            'highlights' => [
                'TWO awards: UK Qualifi Level 7 Diploma + US MBA',
                'Complete in just 1 year',
                'Fully online and flexible',
                'Ofqual-regulated UK diploma + Forbes-ranked US degree',
            ],
        ],
        [
            'slug' => 'bba-walsh-uecampus',
            'title' => 'BBA, Dual Award (UK Diplomas + US Bachelor’s)',
            'level' => "Bachelor's · Fast track · Dual Award",
            'duration' => '2 years',
            'blurb' => 'A full US bachelor’s plus two UK diplomas, three awards, around two years.',
            'detail' => 'A dual-award route to a full degree. You study the Ofqual-regulated UK Qualifi Level 4 and Level 5 Diplomas in Business Management, then top up to a US Bachelor of Business Administration from Walsh College. You finish with both UK diplomas and a US bachelor’s degree, fully online, in around two years.',
            'highlights' => [
                'UK Qualifi Level 4 & 5 Diplomas + US BBA',
                'Full US bachelor’s in around 2 years',
                'Open access, no formal qualifications needed to start',
                'Two internationally recognised awarding bodies',
            ],
        ],
        [
            'slug' => 'msc-cyber-security-walsh-uecampus',
            'title' => 'MSc Cyber Security, Dual Award (UK Diploma + US Master’s)',
            'level' => "Master's · Fast track · Dual Award",
            'duration' => '1 year',
            'blurb' => 'A UK Level 7 diploma AND a US master’s in one of the world’s most in-demand fields.',
            'detail' => 'Defend modern enterprises against real-world threats while earning two qualifications. This dual-award pathway pairs an Ofqual-regulated UK Qualifi Level 7 diploma with a US Master of Science in Cyber Security from Walsh College, covering threat mitigation, digital forensics and ethical hacking, fully online in as little as one year.',
            'highlights' => [
                'TWO awards: UK Qualifi Level 7 Diploma + US MSc',
                'Threat intelligence, forensics and ethical hacking',
                'Complete in just 1 year, fully online',
                'Step into high-demand security leadership roles',
            ],
        ],
        [
            'slug' => 'msc-artificial-intelligence-walsh-uecampus',
            'title' => 'MSc Artificial Intelligence, Dual Award',
            'level' => "Master's · Fast track · Dual Award",
            'duration' => '1 year',
            'blurb' => 'A UK Level 7 diploma AND a US master’s in AI and machine learning.',
            'detail' => 'Go deep on machine learning, neural networks and applied AI while earning two qualifications. This dual-award pathway combines an Ofqual-regulated UK Qualifi Level 7 diploma with a US Master of Science in Artificial Intelligence from Walsh College, fully online, in around one year, for some of the fastest-growing careers in tech.',
            'highlights' => [
                'TWO awards: UK Qualifi Level 7 Diploma + US MSc',
                'Machine learning, deep learning and applied AI',
                'Complete in just 1 year, fully online',
                'Forbes-ranked US institution',
            ],
        ],
        [
            'slug' => 'bsc-cyber-security-walsh-uecampus',
            'title' => 'BSc Cyber Security, Dual Award (UK Diplomas + US Bachelor’s)',
            'level' => "Bachelor's · Fast track · Dual Award",
            'duration' => '2 years',
            'blurb' => 'A full US cyber security degree plus two UK diplomas, in around two years.',
            'detail' => 'Build hands-on skills in defending digital systems and data while earning multiple qualifications. You study the Ofqual-regulated UK Qualifi Level 4 and Level 5 Diplomas in Cyber Security, then top up to a US Bachelor of Science in Cyber Security from Walsh College, fully online, in around two years.',
            'highlights' => [
                'UK Qualifi Level 4 & 5 Diplomas + US BSc',
                'Network defence, ethical hacking and forensics',
                'Full US bachelor’s in around 2 years',
                'Open access, flexible online study',
            ],
        ],
        [
            'slug' => 'bsc-information-technology-walsh-uecampus',
            'title' => 'BSc Information Technology, Dual Award',
            'level' => "Bachelor's · Fast track · Dual Award",
            'duration' => '2 years',
            'blurb' => 'A US IT degree plus two UK diplomas, with pathways into cyber and data.',
            'detail' => 'A dual-award route into a technology career. You study the Ofqual-regulated UK Qualifi Level 4 and Level 5 Diplomas in Information Technology, then top up to a US Bachelor of Science in Information Technology from Walsh College, with pathways into Cybersecurity and Data Analytics, fully online, in around two years.',
            'highlights' => [
                'UK Qualifi Level 4 & 5 Diplomas + US BSc',
                'Pathways into Cybersecurity and Data Analytics',
                'Full US bachelor’s in around 2 years',
                'Two internationally recognised awarding bodies',
            ],
        ],
        [
            'slug' => 'qualifi-level-4-cyber-security',
            'title' => 'Qualifi Level 4 Diploma in Cyber Security',
            'level' => 'Diploma · Ofqual-regulated (UK)',
            'duration' => '8 months',
            'blurb' => 'A practical, Ofqual-regulated entry into cyber security and a route into a degree.',
            'detail' => 'A focused, Ofqual-regulated UK diploma covering threats, defences, cryptography and security operations. It’s a fast, practical way into a high-demand field, and it can act as the first stage of a dual-award degree pathway if you want to top up to a full US BSc.',
            'highlights' => [
                'Ofqual-regulated UK Level 4 diploma',
                'Practical security operations content',
                'Complete in around 8 months',
                'Pathway into a full Cyber Security degree',
            ],
        ],
        [
            'slug' => 'qualifi-level-2-cyber-security',
            'title' => 'Qualifi Level 2 Diploma for Beginners in Cyber Security',
            'level' => 'Diploma · Ofqual-regulated (UK)',
            'duration' => '6 months',
            'blurb' => 'No experience needed, your first step into cyber security.',
            'detail' => 'A beginner-friendly, Ofqual-regulated UK diploma that introduces the core ideas of cyber security with no prior experience required. It’s open access and a clear first step onto the Level 3, Level 4 and degree pathways.',
            'highlights' => [
                'Ofqual-regulated UK Level 2 diploma',
                'No experience or formal qualifications needed',
                'Complete in around 6 months',
                'Clear pathway into Level 3, Level 4 and a degree',
            ],
        ],
    ];
}
