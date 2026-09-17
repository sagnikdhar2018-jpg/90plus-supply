export type Drill = {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  difficulty: string;
  duration: string;
  reps: string;
  workSeconds: number;
  restSeconds: number;
  defaultSets: number;
  desc: string;
  gear: string[];
  steps: string[];
};

export const DRILLS: Drill[] = [
  {
    "id": "drill-1",
    "category": "footwork",
    "categoryLabel": "Footwork & Agility",
    "title": "Icky Shuffle 12-Rung Footwork",
    "difficulty": "Intermediate",
    "duration": "15 Min",
    "reps": "6 Sets x 3 Reps",
    "workSeconds": 45,
    "restSeconds": 15,
    "defaultSets": 6,
    "desc": "Rapid in-in-out lateral footwork across a 6-meter agility ladder. Develops explosive ankle stiffness, deceleration control, and quick cutting angles.",
    "gear": [
      "agility-speed-pro",
      "sock-apex-volt"
    ],
    "steps": [
      "Step 1: Start athletic stance on the left outside edge of the ladder rungs.",
      "Step 2: Plant lead right foot inside rung 1, immediately follow with left foot inside.",
      "Step 3: Step right foot outside to the right, then immediately step left foot into rung 2.",
      "Step 4: Maintain low center of gravity and explode into a 10-meter sprint finish on the final rung."
    ]
  },
  {
    "id": "drill-2",
    "category": "footwork",
    "categoryLabel": "Footwork & Agility",
    "title": "Linear Quick-Feet Cone Slalom",
    "difficulty": "Advanced",
    "duration": "15 Min",
    "reps": "5 Sets x 4 Reps",
    "workSeconds": 40,
    "restSeconds": 20,
    "defaultSets": 5,
    "desc": "Tight 1-meter zig-zag slalom weaving through 8 neon marker cones. Builds hip rotation flexibility and rapid lateral weight transfer.",
    "gear": [
      "agility-cones-50",
      "sock-apex-volt"
    ],
    "steps": [
      "Step 1: Place 8 neon volt cones in a straight line spaced exactly 1 meter apart.",
      "Step 2: Weave through cones using short, choppy micro-steps without crossing ankles.",
      "Step 3: Keep shoulders square forward facing the goal line during lateral transitions.",
      "Step 4: Accelerate 5 meters past the final cone with maximal arm pump drive."
    ]
  },
  {
    "id": "drill-3",
    "category": "footwork",
    "categoryLabel": "Footwork & Agility",
    "title": "Box Deceleration & Cutback Matrix",
    "difficulty": "Pro",
    "duration": "20 Min",
    "reps": "4 Sets x 6 Reps",
    "workSeconds": 50,
    "restSeconds": 25,
    "defaultSets": 4,
    "desc": "High-speed deceleration drill inside a 5x5m box simulating sudden 90\u00b0 boundary line stops and explosive winger recovery sprints.",
    "gear": [
      "agility-cones-50",
      "guard-carbon-pro",
      "sock-apex-volt"
    ],
    "steps": [
      "Step 1: Sprint 100% maximum effort from Cone A to Cone B (5 meters).",
      "Step 2: Plant outside foot hard, absorb momentum, and drop hips for instant deceleration.",
      "Step 3: Perform 90-degree lateral side-shuffle to Cone C with chest upright.",
      "Step 4: Backpedal diagonally to Cone D and immediately burst into forward sprint return."
    ]
  },
  {
    "id": "drill-4",
    "category": "ball-mastery",
    "categoryLabel": "Ball Mastery",
    "title": "La Croqueta Double-Cone Gate",
    "difficulty": "Advanced",
    "duration": "20 Min",
    "reps": "4 Sets x 10 Gate Passes",
    "workSeconds": 45,
    "restSeconds": 15,
    "defaultSets": 5,
    "desc": "Instep-to-instep side hop shift between 2 narrow marker cones to evade lunging defenders. Mastered by Iniesta and Pedri.",
    "gear": [
      "ball-volt-pro",
      "agility-cones-50"
    ],
    "steps": [
      "Step 1: Set 2 marker cones 1 meter apart simulating a defender outstretched tackle.",
      "Step 2: Dribble at medium pace directly toward the right cone.",
      "Step 3: Snap instep of right foot to slide ball laterally across body onto left foot.",
      "Step 4: Push forward with inside of left foot in one continuous, fluid touch."
    ]
  },
  {
    "id": "drill-5",
    "category": "ball-mastery",
    "categoryLabel": "Ball Mastery",
    "title": "Sole-Roll V-Cut Agility Weave",
    "difficulty": "Intermediate",
    "duration": "15 Min",
    "reps": "5 Sets x 8 Cuts",
    "workSeconds": 40,
    "restSeconds": 20,
    "defaultSets": 5,
    "desc": "Roll-back and push-out V-formation touches. Essential for tight midfield evasion and creating 1-yard shooting pockets.",
    "gear": [
      "ball-futsal-pro",
      "agility-cones-50"
    ],
    "steps": [
      "Step 1: Pull ball backward using sole of right cleat toward outside hip.",
      "Step 2: Open hips 45 degrees and push forward using outside of same foot.",
      "Step 3: Catch ball with opposite left sole, pull back, and push out opposite side.",
      "Step 4: Execute with rhythmic cadence, bouncing on toes of support foot."
    ]
  },
  {
    "id": "drill-6",
    "category": "ball-mastery",
    "categoryLabel": "Ball Mastery",
    "title": "Iniesta 360 Spin & Turn Escape",
    "difficulty": "Elite",
    "duration": "20 Min",
    "reps": "4 Sets x 6 Turns",
    "workSeconds": 45,
    "restSeconds": 20,
    "defaultSets": 4,
    "desc": "Roulette 360 spin maneuver rolling the ball with alternating soles across defender center of gravity. Maximum close-control test.",
    "gear": [
      "ball-volt-pro",
      "sock-apex-volt"
    ],
    "steps": [
      "Step 1: Approach stationary dummy or cone with aggressive dribble speed.",
      "Step 2: Step non-dominant foot beside ball and place dominant sole atop ball.",
      "Step 3: Spin 180 degrees, drag ball back, and transfer sole of opposite foot atop ball.",
      "Step 4: Complete the remaining 180 spin and pull ball into open space behind defender."
    ]
  },
  {
    "id": "drill-7",
    "category": "possession",
    "categoryLabel": "Passing & Rondo",
    "title": "5v2 High-Tempo Pressing Rondo",
    "difficulty": "Pro",
    "duration": "25 Min",
    "reps": "3 Rounds x 6 Min",
    "workSeconds": 90,
    "restSeconds": 30,
    "defaultSets": 4,
    "desc": "The Spanish positional training cornerstone. 5 perimeter players maintain possession with maximum 2 touches against 2 central pressing defenders.",
    "gear": [
      "ball-volt-pro",
      "agility-cones-50",
      "sock-pack-3"
    ],
    "steps": [
      "Step 1: Mark a 10m x 10m perimeter grid using 4 high-contrast disc cones.",
      "Step 2: 5 perimeter players circulate ball with sharp body orientation.",
      "Step 3: Enforce strict 2-touch limit (1-touch encouraged for rhythm).",
      "Step 4: Reward 20 consecutive passes with a transition sprint for central defenders."
    ]
  },
  {
    "id": "drill-8",
    "category": "possession",
    "categoryLabel": "Passing & Rondo",
    "title": "Third-Man Wall Pass Combination",
    "difficulty": "Advanced",
    "duration": "20 Min",
    "reps": "5 Sets x 10 Passes",
    "workSeconds": 60,
    "restSeconds": 25,
    "defaultSets": 5,
    "desc": "Up-back-and-through 3-player passing sequence breaking opposition pressing lines. Trains spatial timing and blind-side movement.",
    "gear": [
      "ball-volt-pro",
      "agility-rebound-board",
      "agility-cones-50"
    ],
    "steps": [
      "Step 1: Player A plays firm driven pass into feet of forward Player B.",
      "Step 2: Player B sets 1-touch lay-off cushion pass into supporting midfielder Player C.",
      "Step 3: Player C threads first-time angled through-ball into sprinting path of Player A.",
      "Step 4: Rotate positions clockwise every set to build omnidirectional passing vision."
    ]
  },
  {
    "id": "drill-9",
    "category": "possession",
    "categoryLabel": "Passing & Rondo",
    "title": "60-Meter Driven Diagonal Switch",
    "difficulty": "Elite",
    "duration": "25 Min",
    "reps": "4 Sets x 8 Switches",
    "workSeconds": 60,
    "restSeconds": 30,
    "defaultSets": 4,
    "desc": "Pinged low-trajectory diagonal passes from central midfield to touchline wingers over 50-60 meters. Tests backspin strike technique.",
    "gear": [
      "ball-aerovortex",
      "acc-digital-gauge"
    ],
    "steps": [
      "Step 1: Calibrate ball inflation to 13.5 PSI using digital gauge for uniform flight.",
      "Step 2: Address ball from a 45-degree angle with a 3-step dynamic approach.",
      "Step 3: Strike lower-third of ball with instep bone, generating clean backspin.",
      "Step 4: Ball trajectory must dip under 3 meters elevation directly onto teammate chest."
    ]
  },
  {
    "id": "drill-10",
    "category": "shooting",
    "categoryLabel": "Shooting & Finishing",
    "title": "Dead-Ball Knuckleball Power Dip",
    "difficulty": "Elite",
    "duration": "30 Min",
    "reps": "20 Strikes per foot",
    "workSeconds": 60,
    "restSeconds": 30,
    "defaultSets": 5,
    "desc": "Learn the zero-spin knuckleball strike from 22 meters out using instep bone contact without follow-through for unpredictable aerodynamic deviation.",
    "gear": [
      "ball-aerovortex",
      "acc-digital-gauge"
    ],
    "steps": [
      "Step 1: Align valve facing forward toward goal center.",
      "Step 2: Take 4 paces back and 2 paces wide for upright striking approach.",
      "Step 3: Strike dead center using hard navicular instep bone.",
      "Step 4: Lock ankle rigid and abort follow-through immediately upon ball departure."
    ]
  },
  {
    "id": "drill-11",
    "category": "shooting",
    "categoryLabel": "Shooting & Finishing",
    "title": "First-Time Cutback Volley Strike",
    "difficulty": "Pro",
    "duration": "25 Min",
    "reps": "4 Sets x 6 Volleys",
    "workSeconds": 45,
    "restSeconds": 25,
    "defaultSets": 4,
    "desc": "Striking bouncing cutback delivery from edge of penalty box. Focuses on knee over ball technique, head stillness, and downward trajectory.",
    "gear": [
      "ball-volt-pro",
      "agility-rebound-board"
    ],
    "steps": [
      "Step 1: Rebound ball off board or receive aerial cross at penalty spot.",
      "Step 2: Position non-kicking plant foot 30cm beside ball pointing toward target.",
      "Step 3: Get knee over ball to prevent skying strike over crossbar.",
      "Step 4: Snap laces through center with sharp downward follow-through into bottom corners."
    ]
  },
  {
    "id": "drill-12",
    "category": "shooting",
    "categoryLabel": "Shooting & Finishing",
    "title": "1v1 Striker Breakaway & Dribble Finish",
    "difficulty": "Matchday",
    "duration": "20 Min",
    "reps": "5 Sets x 4 Runs",
    "workSeconds": 40,
    "restSeconds": 25,
    "defaultSets": 5,
    "desc": "High-speed sprint onto through-ball, committing the charging goalkeeper, and executing clinical chip or around-the-keeper roll finish.",
    "gear": [
      "ball-volt-pro",
      "agility-slalom-poles-6"
    ],
    "steps": [
      "Step 1: Accelerate full speed through slalom poles onto rolling match ball.",
      "Step 2: Lift eyes at 14 meters to read goalkeeper stance and weight distribution.",
      "Step 3: Execute feint shoulder drop to shift keeper momentum right.",
      "Step 4: Slot calm sidefoot finish into opposite netting with zero deceleration."
    ]
  },
  {
    "id": "drill-13",
    "category": "goalkeeper",
    "categoryLabel": "Goalkeeper",
    "title": "Rapid Reaction Diving Gate",
    "difficulty": "Pro",
    "duration": "20 Min",
    "reps": "4 Sets x 8 Saves",
    "workSeconds": 35,
    "restSeconds": 20,
    "defaultSets": 4,
    "desc": "Goalkeeper reaction drill using asymmetrical bouncing reflex ball to train explosive lateral ground collapse and smother technique.",
    "gear": [
      "gloves-vortex-pro",
      "ball-reaction-reflex"
    ],
    "steps": [
      "Step 1: Set in balanced, wide-stance athletic posture on goal line.",
      "Step 2: Service from 8 meters using weighted reaction reflex sphere.",
      "Step 3: Collapse lead leg and drive lateral hips flat along turf surface.",
      "Step 4: Form 2-handed W-shape trap behind ball and tuck body into protective shell."
    ]
  },
  {
    "id": "drill-14",
    "category": "goalkeeper",
    "categoryLabel": "Goalkeeper",
    "title": "Near-Post Cross Claim & Distribution",
    "difficulty": "Advanced",
    "duration": "20 Min",
    "reps": "5 Sets x 6 Claims",
    "workSeconds": 45,
    "restSeconds": 25,
    "defaultSets": 5,
    "desc": "Timing aggressive high aerial claims through crowded penalty boxes, protecting takeoff knee, and launching immediate counter-attack throws.",
    "gear": [
      "gloves-vortex-pro",
      "ball-volt-pro"
    ],
    "steps": [
      "Step 1: Start 3 yards off line in ready stance reading cross delivery angle.",
      "Step 2: Attack ball at highest reachable apex with single-foot takeoff.",
      "Step 3: Drive opposite knee upward to protect ribs from incoming attackers.",
      "Step 4: Land balanced and execute sidearm javelin roll to breakout winger."
    ]
  },
  {
    "id": "drill-15",
    "category": "goalkeeper",
    "categoryLabel": "Goalkeeper",
    "title": "Double-Save Collapse & Recovery Reflex",
    "difficulty": "Elite",
    "duration": "25 Min",
    "reps": "4 Sets x 6 Reps",
    "workSeconds": 40,
    "restSeconds": 25,
    "defaultSets": 4,
    "desc": "Immediate floor recovery following initial tip save to deny second-chance rebound finishes. Tests rotational core power.",
    "gear": [
      "gloves-vortex-pro",
      "ball-reaction-reflex",
      "agility-hurdles-6pk"
    ],
    "steps": [
      "Step 1: Dive right to deflect initial driven strike around marker post.",
      "Step 2: Push chest off turf with upper hand, sweeping legs underneath hips.",
      "Step 3: Snap into set posture in under 0.8 seconds facing second shooter.",
      "Step 4: Spring into spread-eagle star save to block point-blank rebound."
    ]
  },
  {
    "id": "drill-16",
    "category": "setpieces",
    "categoryLabel": "Set Pieces",
    "title": "Near-Post Corner Whip Routine",
    "difficulty": "Matchday",
    "duration": "15 Min",
    "reps": "12 Deliveries",
    "workSeconds": 60,
    "restSeconds": 30,
    "defaultSets": 4,
    "desc": "Paced, inswinging delivery whipped across the 6-yard box for glancing flick-on headers into the far side netting.",
    "gear": [
      "ball-volt-pro",
      "acc-captain-armband"
    ],
    "steps": [
      "Step 1: Target delivery 1 meter ahead of near post at shoulder height.",
      "Step 2: Lead near-post runner makes decoy dash across goalkeeper eye-line.",
      "Step 3: Second attacking runner glances header across into opposite top corner.",
      "Step 4: Repeat 12 deliveries with alternating curve trajectories."
    ]
  },
  {
    "id": "drill-17",
    "category": "setpieces",
    "categoryLabel": "Set Pieces",
    "title": "Over-the-Wall Curling Free-Kick Dip",
    "difficulty": "Elite",
    "duration": "25 Min",
    "reps": "15 Free-Kicks",
    "workSeconds": 60,
    "restSeconds": 30,
    "defaultSets": 5,
    "desc": "Curling 24-meter dead-ball strikes over a 4-man defensive wall. Generates Magnus side-and-topspin to dip beneath the crossbar.",
    "gear": [
      "ball-volt-pro",
      "acc-digital-gauge"
    ],
    "steps": [
      "Step 1: Position ball 24 meters out, aligned with right goalpost edge.",
      "Step 2: Approach with 45-degree angle, striking lower-right quadrant of ball.",
      "Step 3: Wrap inside instep around ball with upward diagonal brush.",
      "Step 4: Ball clears defensive wall by 30cm and bends sharp inside near post."
    ]
  },
  {
    "id": "drill-18",
    "category": "setpieces",
    "categoryLabel": "Set Pieces",
    "title": "11-Meter Penalty Stutter Strike",
    "difficulty": "Pro",
    "duration": "15 Min",
    "reps": "10 Penalties",
    "workSeconds": 45,
    "restSeconds": 20,
    "defaultSets": 5,
    "desc": "Cold-blooded penalty run-up technique. Stutter stride forces goalkeeper weight commitment before passing into vacated net corner.",
    "gear": [
      "ball-volt-pro",
      "sock-apex-volt"
    ],
    "steps": [
      "Step 1: Place ball with valve facing kicking foot on penalty spot.",
      "Step 2: Take 5 paces backward on 30-degree approach vector.",
      "Step 3: Execute micro-stutter hesitation on penultimate stride reading keeper legs.",
      "Step 4: Roll smooth, paced sidefoot strike into side-netting opposite keeper dive."
    ]
  }
];
