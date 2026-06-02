INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Thành phố Hà Nội', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Thành phố Hà Nội');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Thành phố Huế', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Thành phố Huế');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Cao Bằng', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Cao Bằng');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Điện Biên', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Điện Biên');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Hà Tĩnh', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Hà Tĩnh');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Lai Châu', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Lai Châu');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Lạng Sơn', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Lạng Sơn');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Nghệ An', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Nghệ An');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Quảng Ninh', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Quảng Ninh');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Thanh Hóa', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Thanh Hóa');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Sơn La', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Sơn La');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Tuyên Quang', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Tuyên Quang');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Lào Cai', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Lào Cai');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Thái Nguyên', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Thái Nguyên');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Phú Thọ', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Phú Thọ');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Bắc Ninh', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Bắc Ninh');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Hưng Yên', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Hưng Yên');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Thành phố Hải Phòng', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Thành phố Hải Phòng');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Ninh Bình', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Ninh Bình');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Quảng Trị', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Quảng Trị');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Thành phố Đà Nẵng', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Thành phố Đà Nẵng');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Quảng Ngãi', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Quảng Ngãi');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Gia Lai', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Gia Lai');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Khánh Hòa', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Khánh Hòa');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Lâm Đồng', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Lâm Đồng');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Đắk Lắk', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Đắk Lắk');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Thành phố Hồ Chí Minh', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Thành phố Hồ Chí Minh');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Đồng Nai', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Đồng Nai');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Tây Ninh', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Tây Ninh');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Thành phố Cần Thơ', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Thành phố Cần Thơ');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Vĩnh Long', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Vĩnh Long');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Đồng Tháp', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Đồng Tháp');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh Cà Mau', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh Cà Mau');

INSERT INTO administrative_units (name, unit_level, unit_kind, parent_id, is_active)
SELECT 'Tỉnh An Giang', 'PROVINCE', NULL, 1, true
WHERE NOT EXISTS (SELECT 1 FROM administrative_units WHERE name = 'Tỉnh An Giang');