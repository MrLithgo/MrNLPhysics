// Simulation Icons Index
export const simulationIcons = {
  trolley: {
    id: 'trolley',
    title: 'Investigating Motion',
    subtitle: 'Trolley and Ramp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke="currentColor" stroke-width="1.5">
            <rect transform="rotate(23.7214 10.053 8.68634)" height="5.31243" width="12.2991" y="6.03012" x="3.90342" fill="none"/>
            <line y2="21.09329" x2="22.78111" y1="11.63025" x1="1.2189" fill="none"/>
            <ellipse ry="1.71873" rx="1.71873" cy="10.62468" cx="5.68759" fill="#ffffff"/>
            <ellipse ry="1.71873" rx="1.71873" cy="13.12465" cx="11.50001" fill="#ffffff"/>
          </svg>`
  },
  friction: {
    id: 'friction',
    title: 'Investigating Friction',
    subtitle: 'Forces in Action',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <rect x="6.28" y="7.51" width="16.75" height="8.5"/>
            <polyline points="17.58,17.52 0.99,17.51 3.14,15.07 "/>
            <line x1="3.03" y1="19.92" x2="1.06" y2="17.68"/>
          </svg>`
  },
  secondLaw: {
    id: 'second-law',
    title: "Newton's Second Law",
    subtitle: 'F = ma',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 25 25" stroke="currentColor">
            <circle cx="7.5" cy="12.5" r="5" fill="none" stroke-width="1.5"/>
            <line x1="13" y1="12.5" x2="22.5" y2="12.5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2,2"/>
          </svg>`
  },
  stoppingDistance: {
    id: 'stopping-distance',
    title: 'Stopping Distance',
    subtitle: 'Thinking & Braking',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="4.98" y="10" width="14.84" height="6.52"/>
            <rect x="7.2" y="3.58" width="10.25" height="6.25"/>
            <rect x="5.4" y="16.67" width="2.5" height="4.24"/>
            <rect x="16.65" y="16.67" width="2.5" height="4.24"/>
            <circle cx="8.24" cy="13.08" r="1"/>
            <circle cx="16.49" cy="13.08" r="1"/>
          </svg>`
  },
  hookesLaw: {
    id: 'hookes-law',
    title: 'Investigating Extension',
    subtitle: 'Force and Extension',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
            <line x1="1.39" y1="1.56" x2="23.83" y2="1.49"/>
            <polyline points="12.67,1.57 12.7,6.77 17.62,8.3 8.74,10.95 17.73,14.26 8.47,17.88 13.25,20.02 13.38,23.07 "/>
          </svg>`
  },
  momentum: {
    id: 'momentum',
    title: 'Momentum - Separate Physics Only',
    subtitle: 'Conservation Laws',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="8.16" cy="9.77" r="3.12"/>
            <circle cx="10.91" cy="17.02" r="3.12"/>
            <polyline points="10.3,7.5 14.08,4.1 10.81,3.61 "/>
            <line x1="14.13" y1="4.45" x2="14.35" y2="7.24"/>
            <polyline points="14.4,18.79 19.02,20.89 18.16,17.69 "/>
            <line x1="18.73" y1="21.08" x2="16.26" y2="22.39"/>
          </svg>`
  },
  moments: {
    id: 'moments',
    title: 'Moments - Separate Physics Only',
    subtitle: 'Turning Forces',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" stroke="currentColor">
            <line x1="1" y1="11" x2="24" y2="11" />
            <line x1="12.5" y1="11" x2="11" y2="16" />
            <line x1="12.5" y1="11" x2="14" y2="16" />
            <line x1="22" y1="11" x2="22" y2="16" />
            <line x1="20" y1="14" x2="22" y2="16" />
            <line x1="24" y1="14" x2="22" y2="16" />
            <line x1="7" y1="11" x2="7" y2="19" />
            <line x1="5" y1="17" x2="7" y2="19" />
            <line x1="9" y1="17" x2="7" y2="19" />
            <line x1="11" y1="16" x2="14" y2="16" />
          </svg>`
  }
}

export const getIcon = (iconId) => {
  return simulationIcons[iconId] || null
}

export const getAllIcons = () => {
  return Object.values(simulationIcons)
}
