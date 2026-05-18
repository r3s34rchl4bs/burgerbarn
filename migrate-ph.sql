-- Philippines localisation + Grab Food update

UPDATE tasks SET
  title = 'Register your business',
  description = 'Register as Sole Proprietor with DTI, or as OPC/Corporation with SEC. For a multi-partner setup, a Corporation with SEC is the better structure — it separates personal liability from the business. Secure your Barangay Clearance early as other permits depend on it.'
WHERE id = 'p2t2';

UPDATE tasks SET
  description = 'Explore DTI''s Pondo sa Pagbabago at Pag-asenso (P3), SB Corporation microfinance loans, or local banks (BDO, BPI, Landbank of the Philippines). Private investors and partner capital pooling are also options. Have your business plan and personal financials ready before any bank meeting.'
WHERE id = 'p2t4';

UPDATE tasks SET
  description = 'Required permits for Bacolod City: Mayor''s Permit (Business Permit from City Hall), Barangay Clearance, BIR Certificate of Registration, Sanitary Permit from City Health Office, Fire Safety Inspection Certificate from BFP Bacolod, and FDA License to Operate (LTO) for food business. Apply at least 2 months before opening — each office has its own timeline.'
WHERE id = 'p2t5';

UPDATE tasks SET
  description = 'Train all staff on HACCP food safety principles — required for FDA Philippines compliance. Cover the full menu, portion specs, and speed drills. Run timed ticket simulations before opening. Cost targets: food 28–33%, labor 25–30%, prime cost under 60%.'
WHERE id = 'p4t5';

UPDATE tasks SET
  title = 'List on GrabFood and Foodpanda',
  description = 'Register on GrabFood and Foodpanda from day one. GrabFood typically has stronger market penetration in Bacolod. Both platforms charge 20–30% commission — price your delivery menu 15–20% higher to protect margins, or build the commission into your regular pricing.'
WHERE id = 'p5t5';

UPDATE tasks SET
  description = 'Reach out to Bacolod food bloggers, The News Today, Visayan Daily Star, and active local Facebook groups (Bacolod Food Trip, Bacolod Eats, etc.). Offer a media preview before soft opening. Local food bloggers have strong community reach in Bacolod — one well-shared post can fill your opening week.'
WHERE id = 'p5t3';

UPDATE tasks SET
  description = 'Build a website with menu, location (include Waze/Google Maps pin), hours, and GrabFood/Foodpanda ordering links. Claim your Google Business Profile immediately — Bacolod diners search Google Maps before deciding where to eat.'
WHERE id = 'p5t2';

UPDATE tasks SET
  description = 'Lock in primary and backup suppliers for beef, buns, produce, sauces, and packaging. In Bacolod, check SM Supermarket wholesale, Bacolod Public Market suppliers, and Metro Gaisano wholesale. Always have a backup for beef and buns — they are your core product.'
WHERE id = 'p4t1';
