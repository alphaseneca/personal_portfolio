/*window.addEventListener("resize", function () {
	var icons = document.querySelectorAll(".social-icons");
	var screenWidth = window.innerWidth;

	icons.forEach(function (icon) {
		// Gradually decrease the size of the icons based on screen width
		//icon.style.width = screenWidth / 30 + "px"; // Adjust the division factor as needed
		if (screenWidth / 30 > 32) {
			icon.style.width = 32 + "px";
			icon.style.height = 32 + "px";
		} else {
			icon.style.width = screenWidth / 30 + "px";
			icon.style.height = screenWidth / 30 + "px";
		}
		//icon.style.height = screenWidth / 30 + "px"; // Adjust the division factor as needed
	});
});*/

function renderSkills(skillsData) {
  // Render tools
  const toolsGrid = document.getElementById('toolsGrid');
  toolsGrid.innerHTML = '';
  skillsData.tools.forEach((tool, idx) => {
    const div = document.createElement('div');
    div.className = 'skill-item' + (idx === 0 ? ' active' : '');
    div.setAttribute('data-skill', tool.id);
    div.innerHTML = `<span>${tool.name.replace(' ', '<br>')}</span>`;
    div.addEventListener('click', () => selectSkill(tool, div, 'tool'));
    toolsGrid.appendChild(div);
  });
  // Render languages
  const languagesGrid = document.getElementById('languagesGrid');
  languagesGrid.innerHTML = '';
  skillsData.languages.forEach(lang => {
    const div = document.createElement('div');
    div.className = 'skill-item';
    div.setAttribute('data-skill', lang.id);
    div.innerHTML = `<span>${lang.name.replace(' ', '<br>')}</span>`;
    div.addEventListener('click', () => selectSkill(lang, div, 'lang'));
    languagesGrid.appendChild(div);
  });
  // Show first tool by default
  selectSkill(skillsData.tools[0], toolsGrid.children[0], 'tool');
}

function selectSkill(skill, el, type) {
  // Remove active from all
  document.querySelectorAll('.skill-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  // Update panel
  document.getElementById('skillTitle').textContent = skill.name;
  document.getElementById('skillDesc').textContent = skill.description;
  document.getElementById('experienceText').textContent = 'Experience:\n' + skill.experience;
  // Animate progress bar
  const progressBar = document.getElementById('progressBar');
  progressBar.style.width = '0%';
  setTimeout(() => {
    progressBar.style.width = skill.confidence + '%';
  }, 100);
}

function parseDate(dateStr) {
  // Handles 'Present', 'Jun, 2023', '2020', etc.
  if (dateStr.toLowerCase() === 'present') return new Date(3000, 0, 1); // far future for sorting
  const d = Date.parse(dateStr);
  if (!isNaN(d)) return new Date(d);
  // Try year only
  const year = parseInt(dateStr);
  if (!isNaN(year)) return new Date(year, 0, 1);
  return new Date(0);
}

function renderTimeline(data) {
  // Sort by date descending (latest first)
  data.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  
  // Separate work and education
  const workItems = data.filter(item => item.type === 'work');
  const educationItems = data.filter(item => item.type === 'education');
  
  // Render work timeline
  const workTimeline = document.getElementById('workTimelineItems');
  workTimeline.innerHTML = '';
  workItems.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'timeline-item work';
    if (idx === 0) div.classList.add('latest');
    div.innerHTML = `
      <div class="timeline-date">${item.date}</div>
      <h3 class="timeline-job">${item.title}</h3>
      <p class="timeline-company">${item.company}</p>
      ${item.location ? `<p class="timeline-company">${item.location}</p>` : ''}
    `;
    workTimeline.appendChild(div);
  });
  
  // Render education timeline
  const educationTimeline = document.getElementById('educationTimelineItems');
  educationTimeline.innerHTML = '';
  educationItems.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'timeline-item education';
    div.innerHTML = `
      <div class="timeline-date">${item.date}</div>
      <h3 class="timeline-job">${item.title}</h3>
      <p class="timeline-company">${item.company}</p>
      ${item.location ? `<p class="timeline-company">${item.location}</p>` : ''}
    `;
    educationTimeline.appendChild(div);
  });
  
  // Sync scrolling between the two timelines
  const workScroll = document.getElementById('workTimeline');
  const educationScroll = document.getElementById('educationTimeline');
  
  workScroll.addEventListener('scroll', () => {
    educationScroll.scrollLeft = workScroll.scrollLeft;
  });
  
  educationScroll.addEventListener('scroll', () => {
    workScroll.scrollLeft = educationScroll.scrollLeft;
  });
}

function renderProjects(data) {
  const software = document.getElementById('softwareProjects');
  const hardware = document.getElementById('hardwareProjects');
  // Remove all except heading
  software.innerHTML = '<h3>Software</h3>';
  hardware.innerHTML = '<h3>Hardware</h3>';
  data.forEach(project => {
    const div = document.createElement('div');
    div.className = 'project-item project-hover';
    div.innerHTML = `
      <h4 class="project-title">${project.title}</h4>
      <p class="project-desc">${project.description}</p>
      <a href="${project.link}" class="project-link">Link to it.</a>
    `;
    if (project.type === 'software') software.appendChild(div);
    else hardware.appendChild(div);
  });
}

function enableDragScroll(selector) {
  const grids = document.querySelectorAll(selector);
  grids.forEach(grid => {
    let isDown = false;
    let startX, scrollLeft;

    grid.addEventListener('mousedown', (e) => {
      isDown = true;
      grid.classList.add('dragging');
      startX = e.pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    });
    grid.addEventListener('mouseleave', () => {
      isDown = false;
      grid.classList.remove('dragging');
    });
    grid.addEventListener('mouseup', () => {
      isDown = false;
      grid.classList.remove('dragging');
    });
    grid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - grid.offsetLeft;
      const walk = (x - startX) * 1.5;
      grid.scrollLeft = scrollLeft - walk;
    });
    // Touch support
    grid.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    });
    grid.addEventListener('touchend', () => {
      isDown = false;
    });
    grid.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - grid.offsetLeft;
      const walk = (x - startX) * 1.5;
      grid.scrollLeft = scrollLeft - walk;
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  enableDragScroll('.skills-grid');
});

// Fetch and render skills from JSON
fetch('skillsData.json')
  .then(response => {
    console.log('skillsData.json status:', response.status);
    return response.text();
  })
  .then(text => {
    console.log('skillsData.json content:', text);
    return JSON.parse(text);
  })
  .then(skillsData => {
    renderSkills(skillsData);
  })
  .catch(err => {
    console.error('Error loading skills data:', err);
  });

// Fetch and render experience/education
fetch('experienceData.json')
  .then(r => r.json())
  .then(data => renderTimeline(data));

// Fetch and render projects
fetch('projectsData.json')
  .then(r => r.json())
  .then(data => renderProjects(data));

// Drag-to-scroll for timeline
const timelineScroll = document.querySelector('.timeline-scroll');
if (timelineScroll) {
  let isDown = false, startX, scrollLeft;
  timelineScroll.addEventListener('mousedown', (e) => {
    isDown = true;
    timelineScroll.classList.add('dragging');
    startX = e.pageX - timelineScroll.offsetLeft;
    scrollLeft = timelineScroll.scrollLeft;
  });
  timelineScroll.addEventListener('mouseleave', () => {
    isDown = false;
    timelineScroll.classList.remove('dragging');
  });
  timelineScroll.addEventListener('mouseup', () => {
    isDown = false;
    timelineScroll.classList.remove('dragging');
  });
  timelineScroll.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - timelineScroll.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll-fast
    timelineScroll.scrollLeft = scrollLeft - walk;
  });
}
