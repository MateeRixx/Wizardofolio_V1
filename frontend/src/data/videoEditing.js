/* ─────────────────────────────────────────────────────────────────────
   videoEditing.js  —  Video Editing section

   HOW TO ADD A PROJECT:
   1. Drop your video + thumbnail into:
        public/works/video-editing/
   2. Supported video formats: .mp4, .webm
   3. File path examples:
        video at     public/works/video-editing/reel.mp4
        thumbnail at public/works/video-editing/reel-thumb.jpg
        paths      → "/works/video-editing/reel.mp4"
                     "/works/video-editing/reel-thumb.jpg"
───────────────────────────────────────────────────────────────────── */
export const videoEditing = {
  id:          "video-editing",
  label:       "Video Editing",
  shortLabel:  "Video Editing",
  number:      "03",
  description: "Cinematic cuts, motion graphics, and pacing that turn raw footage into compelling narratives.",
  color:       "#CE8715",

  items: [
    {
      id:          "ve-1",
      title:       "Showreel Short 1",
      description: "A dynamic short-form reel showcasing creative cuts and transitions.",
      type:        "youtube",
      portrait:    true,
      tags:        ["Shorts", "Editing", "Reel"],
      url:         "https://www.youtube.com/embed/0ygpO-Mshko",
      thumbnail:   "https://img.youtube.com/vi/0ygpO-Mshko/maxresdefault.jpg",
    },
    {
      id:          "ve-2",
      title:       "Creative Edit 1",
      description: "Visual exploration of kinetic effects and overlays in commercial editing.",
      type:        "youtube",
      portrait:    false,
      tags:        ["Editing", "VFX", "After Effects"],
      url:         "https://www.youtube.com/embed/hkgb0kIROlA",
      thumbnail:   "https://img.youtube.com/vi/hkgb0kIROlA/maxresdefault.jpg",
    },
    {
      id:          "ve-3",
      title:       "Creative Edit 2",
      description: "Full-length edit focusing on pacing, rhythm, and color harmony.",
      type:        "youtube",
      portrait:    false,
      tags:        ["Commercial", "Pacing", "Color Grade"],
      url:         "https://www.youtube.com/embed/8KoBfXjhb30",
      thumbnail:   "https://img.youtube.com/vi/8KoBfXjhb30/maxresdefault.jpg",
    },
    {
      id:          "ve-4",
      title:       "Showreel Short 2",
      description: "Motion-focused short reel with fluid animation and snappy cuts.",
      type:        "youtube",
      portrait:    true,
      tags:        ["Shorts", "Motion", "Animation"],
      url:         "https://www.youtube.com/embed/aJXFZmcmu9w",
      thumbnail:   "https://img.youtube.com/vi/aJXFZmcmu9w/maxresdefault.jpg",
    },
    {
      id:          "ve-5",
      title:       "Showreel Short 3",
      description: "Short-form cinematic edit with precise timing and visual rhythm.",
      type:        "youtube",
      portrait:    true,
      tags:        ["Shorts", "Cinematic", "Editing"],
      url:         "https://www.youtube.com/embed/FReG0itT9Dg",
      thumbnail:   "https://img.youtube.com/vi/FReG0itT9Dg/maxresdefault.jpg",
    },
    {
      id:          "ve-6",
      title:       "Showreel Short 4",
      description: "Dynamic short showcasing color grading and creative transitions.",
      type:        "youtube",
      portrait:    true,
      tags:        ["Shorts", "Color Grade", "Transitions"],
      url:         "https://www.youtube.com/embed/d5K3ipvd4RY",
      thumbnail:   "https://img.youtube.com/vi/d5K3ipvd4RY/maxresdefault.jpg",
    },
    {
      id:          "ve-7",
      title:       "Showreel Short 5",
      description: "High-energy short reel with impactful cuts and visual storytelling.",
      type:        "youtube",
      portrait:    true,
      tags:        ["Shorts", "Storytelling", "Reel"],
      url:         "https://www.youtube.com/embed/xzomUL90glY",
      thumbnail:   "https://img.youtube.com/vi/xzomUL90glY/maxresdefault.jpg",
    },
  ],
};
