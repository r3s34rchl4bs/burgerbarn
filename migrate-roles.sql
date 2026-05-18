-- Fix display names and assign roles
UPDATE users SET name = 'Partner One',   role = 'owner'   WHERE email = 'flip@burgerbarn.app';
UPDATE users SET name = 'Partner Two',   role = 'partner' WHERE email = 'grill@burgerbarn.app';
UPDATE users SET name = 'Partner Three', role = 'partner' WHERE email = 'smash@burgerbarn.app';
