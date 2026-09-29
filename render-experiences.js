const fs = require('fs');
const path = require('path');
const { escapeHtml } = require('./utils/html');

const LOCAL_DATA_PATH = path.join(__dirname, 'data', 'experiences.json');
const REQUIRED_FIELDS = [
    'date',
    'title',
    'company',
    'playlistCompany',
    'category',
    'playlistDuration',
    'summary',
];

function loadExperiences() {
    const json = fs.readFileSync(LOCAL_DATA_PATH, 'utf8');
    let data;

    try {
        data = JSON.parse(json);
    } catch (error) {
        throw new Error(`Experience data must be valid JSON: ${error.message}`);
    }

    if (!data || !Array.isArray(data.experiences) || data.experiences.length === 0) {
        throw new Error('Experience data must contain a non-empty "experiences" array.');
    }

    data.experiences.forEach((experience, index) => {
        const label = `Experience ${index + 1}`;
        if (!experience || typeof experience !== 'object') {
            throw new Error(`${label} must be an object.`);
        }

        REQUIRED_FIELDS.forEach((field) => {
            if (typeof experience[field] !== 'string' || !experience[field].trim()) {
                throw new Error(`${label} requires a non-empty "${field}" string.`);
            }
        });

        ['highlights', 'technologies'].forEach((field) => {
            if (
                !Array.isArray(experience[field]) ||
                experience[field].length === 0 ||
                experience[field].some((value) => typeof value !== 'string' || !value.trim())
            ) {
                throw new Error(`${label} requires a non-empty "${field}" array of strings.`);
            }
        });
    });

    return data.experiences;
}

function renderTimeline(experiences) {
    return experiences
        .map(
            (experience) => `
            <div class="timeline-item">
                <div class="timeline-date">${escapeHtml(experience.date)}</div>
                <div class="timeline-content">
                    <h3>${escapeHtml(experience.title)}</h3>
                    <h4 class="company">${escapeHtml(experience.company)}</h4>
                    <p>${escapeHtml(experience.summary)}</p>
                    <ul class="job-details">
${experience.highlights.map((highlight) => `                        <li>${escapeHtml(highlight)}</li>`).join('\n')}
                    </ul>
                    <div class="tags">
${experience.technologies.map((technology) => `                        <span>${escapeHtml(technology)}</span>`).join('\n')}
                    </div>
                </div>
            </div>`,
        )
        .join('\n');
}

function renderPlaylist(experiences) {
    return experiences
        .map(
            (experience, index) => `
                <div class="track-row${index === 0 ? ' playing' : ''}" onclick="toggleTrack(this)">
                    <div class="track-main">
                        <div class="col-play">
                            <span class="track-num">${index + 1}</span>
                            <span class="play-icon">▶</span>
                        </div>
                        <div class="col-title">
                            <span class="song-title">${escapeHtml(experience.title)}</span>${index === 0 ? '\n                            <span class="explicit-badge">E</span>' : ''}
                        </div>
                        <div class="col-album">${escapeHtml(experience.playlistCompany)}</div>
                        <div class="col-genre">${escapeHtml(experience.category)}</div>
                        <div class="col-duration">${escapeHtml(experience.playlistDuration)}</div>
                    </div>
                    <div class="track-lyrics">
                        <div class="lyrics-content">
                            <p class="lyrics-intro">&quot;${escapeHtml(experience.summary)}&quot;</p>
                            <ul class="lyrics-lines">
${experience.highlights.map((highlight) => `                                <li>${escapeHtml(highlight)}</li>`).join('\n')}
                            </ul>
                            <div class="track-tags">
${experience.technologies.map((technology) => `                                <span>#${escapeHtml(technology.replace(/\s+/g, ''))}</span>`).join('\n')}
                            </div>
                        </div>
                    </div>
                </div>`,
        )
        .join('\n');
}

function renderExperiences(template) {
    const experiences = loadExperiences();
    return template
        .replace('<!-- EXPERIENCE_TIMELINE -->', renderTimeline(experiences))
        .replace('<!-- EXPERIENCE_PLAYLIST -->', renderPlaylist(experiences));
}

module.exports = { renderExperiences };
