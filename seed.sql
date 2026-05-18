-- Phases
INSERT OR IGNORE INTO phases (number, title, months) VALUES
  (1, 'Concept & Market Research', 'Month 1–2'),
  (2, 'Legal & Finance',           'Month 2–3'),
  (3, 'Location & Build-Out',      'Month 3–5'),
  (4, 'Operations & Staffing',     'Month 5–6'),
  (5, 'Marketing',                 'Month 6'),
  (6, 'Launch & Growth',           'Month 7+');

-- Phase 1 tasks
INSERT OR IGNORE INTO tasks (id, phase_id, title, description, status, order_index) VALUES
  ('p1t1', 1, 'Define the concept',
   'Decide between fast-casual, sit-down, ghost kitchen, smash vs gourmet vs classic. This decision shapes everything — kitchen layout, staffing, price point, location.',
   'not_started', 1),
  ('p1t2', 1, 'Identify target customer',
   'Define target customer by age, income, and lifestyle. Build a customer persona — "everyone who likes burgers" is not a target.',
   'not_started', 2),
  ('p1t3', 1, 'Map every competitor within 3-mile radius',
   'Visit and note their prices, wait times, quality, and where they fall short.',
   'not_started', 3),
  ('p1t4', 1, 'Research foot traffic and market demand',
   'Use Google Maps data, talk to nearby business owners, observe peak hours.',
   'not_started', 4),
  ('p1t5', 1, 'Develop tight menu of 5–8 items',
   'Target 28–32% food cost. Every item must earn its spot.',
   'not_started', 5),
  ('p1t6', 1, 'Establish full brand identity',
   'Name, logo, colors, tone of voice, packaging aesthetic.',
   'not_started', 6);

-- Phase 2 tasks
INSERT OR IGNORE INTO tasks (id, phase_id, title, description, status, order_index) VALUES
  ('p2t1', 2, 'Write full business plan',
   '3-year financial projections — revenue, COGS, labor, rent, and break-even point.',
   'not_started', 1),
  ('p2t2', 2, 'Register as LLC',
   'Separate personal liability from business liability.',
   'not_started', 2),
  ('p2t3', 2, 'Build detailed startup budget',
   'Include 20% buffer. Equipment, buildout, permits, inventory, marketing, POS, signage, uniforms.',
   'not_started', 3),
  ('p2t4', 2, 'Secure funding',
   'SBA 7(a) loans, investors, or savings. Have business plan and personal financials ready.',
   'not_started', 4),
  ('p2t5', 2, 'Apply for all permits and licenses',
   'Food service, health department, fire safety, business license, EIN, alcohol if needed. Apply early — these take time.',
   'not_started', 5),
  ('p2t6', 2, 'Build 6-month operating cash reserve',
   'On top of startup costs. Restaurants ramp slowly — you need the runway.',
   'not_started', 6);

-- Phase 3 tasks
INSERT OR IGNORE INTO tasks (id, phase_id, title, description, status, order_index) VALUES
  ('p3t1', 3, 'Scout locations',
   'Prioritize foot traffic, parking, and visibility. Corners are best.',
   'not_started', 1),
  ('p3t2', 3, 'Negotiate lease',
   'Use a tenant rep agent — rent-free build-out period, exit clauses, cap on annual increases. The landlord pays the rep, it costs you nothing.',
   'not_started', 2),
  ('p3t3', 3, 'Finalize kitchen layout',
   'Optimize for speed: prep → cooking → plating → pickup. Bottlenecks mean slow tickets and bad reviews.',
   'not_started', 3),
  ('p3t4', 3, 'Hire contractor — get 3 quotes',
   'Put everything in writing: timeline, materials, milestones, payment schedule.',
   'not_started', 4),
  ('p3t5', 3, 'Purchase equipment',
   'Griddle, fryers, hood system, refrigeration, walk-in cooler, POS hardware. Buy commercial-grade.',
   'not_started', 5),
  ('p3t6', 3, 'Pass all inspections',
   'Health department, fire marshal, ADA compliance, grease trap. Schedule in advance.',
   'not_started', 6);

-- Phase 4 tasks
INSERT OR IGNORE INTO tasks (id, phase_id, title, description, status, order_index) VALUES
  ('p4t1', 4, 'Lock in primary and backup suppliers',
   'Beef, buns, produce, sauces, and packaging. Always have a backup for beef and buns — they are your core product.',
   'not_started', 1),
  ('p4t2', 4, 'Document all recipes and SOPs',
   'Every item needs a spec sheet: exact weights, cook times, temperatures, plating instructions. Consistency requires documentation.',
   'not_started', 2),
  ('p4t3', 4, 'Set up POS and full tech stack',
   'Set up before hiring. Learn the system yourself first.',
   'not_started', 3),
  ('p4t4', 4, 'Hire kitchen lead',
   'The most critical hire. Pay above market. They train the team, maintain standards, and run the line when you are not there.',
   'not_started', 4),
  ('p4t5', 4, 'Train all staff',
   'ServSafe certification, full menu, and speed drills. Time your tickets during training. Targets: food cost 28–33%, labor 25–30%, prime cost under 60%.',
   'not_started', 5);

-- Phase 5 tasks
INSERT OR IGNORE INTO tasks (id, phase_id, title, description, status, order_index) VALUES
  ('p5t1', 5, 'Launch Instagram and TikTok',
   '6–8 weeks before opening. Document the build — kitchen going in, logo reveal, first burger cook.',
   'not_started', 1),
  ('p5t2', 5, 'Build website and claim Google Business Profile',
   'Menu, location, hours, and online ordering link.',
   'not_started', 2),
  ('p5t3', 5, 'Reach out to local press and food bloggers',
   'Offer a media preview before soft opening. One well-placed article can make your opening week.',
   'not_started', 3),
  ('p5t4', 5, 'Plan soft opening and grand opening',
   'Soft opening for friends and family first, then a grand opening with a compelling offer — not just a discount, an experience.',
   'not_started', 4),
  ('p5t5', 5, 'List on DoorDash, Uber Eats, and Grubhub',
   'From day one. Delivery fees are 20–30% — price accordingly or use a slightly higher delivery menu.',
   'not_started', 5),
  ('p5t6', 5, 'Build review collection strategy',
   'Target Google and Yelp. Ask every happy guest. The first 20 reviews set your reputation.',
   'not_started', 6);

-- Phase 6 tasks
INSERT OR IGNORE INTO tasks (id, phase_id, title, description, status, order_index) VALUES
  ('p6t1', 6, 'Run soft launch',
   'Find and fix operational gaps. Something will break — better with friends than paying strangers.',
   'not_started', 1),
  ('p6t2', 6, 'Track daily metrics',
   'Total sales, average ticket, food cost %, labor cost %, covers per hour.',
   'not_started', 2),
  ('p6t3', 6, 'Menu optimization at 30 days',
   'Cut the 2 lowest-selling items, add 1 new experiment.',
   'not_started', 3),
  ('p6t4', 6, 'Launch loyalty program',
   'By month 2–3. Repeat customers are your profit — retention is far cheaper than acquisition.',
   'not_started', 4),
  ('p6t5', 6, 'Complete 6-month P&L review',
   'Full P&L and business review at the 6-month mark.',
   'not_started', 5),
  ('p6t6', 6, 'Adjust based on data',
   'Adjust everything based on data, not gut feel.',
   'not_started', 6);
