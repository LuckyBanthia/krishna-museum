-- =========================
-- DATABASE
-- =========================
CREATE DATABASE krishna_museum;
USE krishna_museum;

-- =========================
-- USERS TABLE
-- =========================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

-- Default accounts (1 Admin and 1 User)
INSERT INTO users (user_id, name, email, password, role) VALUES
(1, 'Admin', 'admin@gmail.com', 'admin123', 'ADMIN'),
(2, 'Default User', 'user@gmail.com', 'user123', 'USER');

-- =========================
-- ARTEFACT TABLE
-- =========================
CREATE TABLE artefact (
    artefact_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50),
    material VARCHAR(100),
    dynasty VARCHAR(100),
    region VARCHAR(100),
    deity VARCHAR(100),
    museum VARCHAR(150),
    description TEXT,
    image_url VARCHAR(255),
    floor INT
);

-- =========================
-- EVENT TABLE
-- =========================
CREATE TABLE event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(150),
    category VARCHAR(50),
    image_url VARCHAR(255),
    capacity INT,
    registered INT DEFAULT 0,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CONTACT MESSAGES TABLE
-- =========================
CREATE TABLE contact_message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- WISHLIST TABLE
-- =========================
CREATE TABLE wishlist (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    artefact_id INT NOT NULL,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE KEY unique_user_artefact (user_id, artefact_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (artefact_id) REFERENCES artefact(artefact_id) ON DELETE CASCADE
);

-- =========================
-- CONSTRAINT (VALIDATION)
-- =========================
ALTER TABLE artefact
ADD CONSTRAINT chk_type
CHECK (type IN ('Sculpture','Painting','Coin','Inscription','Ritual Object'));

-- =========================
-- INDEXES (PERFORMANCE)
-- =========================
CREATE INDEX idx_name ON artefact(name);
CREATE INDEX idx_type ON artefact(type);
CREATE INDEX idx_dynasty ON artefact(dynasty);
CREATE INDEX idx_deity ON artefact(deity);

-- =========================
-- TRIGGER (PROTECT DATA)
-- =========================
DELIMITER $$

CREATE TRIGGER prevent_delete
BEFORE DELETE ON artefact
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Deletion not allowed!';
END$$

DELIMITER ;
-- =========================
-- INSERT ALL ARTEFACTS
-- =========================

INSERT INTO artefact 
(code,name,type,material,dynasty,region,deity,museum,description,image_url,floor)
VALUES

-- FLOOR 1 (SCULPTURES)
('SKM001','Nataraja','Sculpture','Bronze','Chola, 10th century','Tamil Nadu','Shiva','Krishna Museum','Cosmic dance of Shiva','/images/1.jpg',1),
('SKM002','Krishna Govardhana','Sculpture','Stone','Kushana, 2nd century','Mathura','Krishna','Krishna Museum','Krishna lifting Govardhan hill','/images/2.jpg',1),
('SKM003','Venugopala Krishna','Sculpture','Bronze','Vijayanagara, 15th century','Karnataka','Krishna','Krishna Museum','Krishna playing flute','/images/3.jpg',1),
('SKM004','Vishnu with Chakra','Sculpture','Stone','Gupta, 5th century','Uttar Pradesh','Vishnu','Krishna Museum','Vishnu holding chakra','/images/4.jpg',1),
('SKM005','Yakshi Figure','Sculpture','Terracotta','Mauryan, 3rd century BC','Kurukshetra','Yakshi','Krishna Museum','Fertility figure','/images/5.jpg',1),
('SKM006','Balarama','Sculpture','Bronze','Pallava, 8th century','Tamil Nadu','Balarama','Krishna Museum','Krishna brother','/images/6.jpg',1),
('SKM007','Radha-Krishna','Sculpture','Stone','Medieval, 12th century','Rajasthan','Radha-Krishna','Krishna Museum','Divine love','/images/7.jpg',1),
('SKM008','Krishna Ivory','Sculpture','Ivory','Mughal, 17th century','Punjab','Krishna','Krishna Museum','Ivory carving','/images/8.jpg',1),
('SKM009','Durga Sculpture','Sculpture','Wood','Pala, 10th century','Bengal','Durga','Krishna Museum','Durga slaying demon','/images/9.jpg',1),
('SKM010','Ardhanarishvara','Sculpture','Bronze','Chola, 11th century','Tamil Nadu','Shiva-Parvati','Krishna Museum','Half male female form','/images/10.jpg',1),
('SKM046','Priest King Bust','Sculpture','Stone','Indus Valley, 2500 BC','Rakhigarhi','None','Krishna Museum','Ancient bust','/images/46.jpg',1),
('SKM052','Buddha in Dharmachakra Mudra','Sculpture','Sandstone','Gupta, 5th century','Sarnath','Buddha','Krishna Museum','Buddha sermon posture','/images/52.jpg',1),
('SKM057','Dancing Ganesha','Sculpture','Soapstone','Hoysala, 13th century','Karnataka','Ganesha','Krishna Museum','Dancing Ganesha','/images/57.jpg',1),

-- FLOOR 2 (PAINTINGS + INSCRIPTIONS)
('SKM011','Rasa Lila','Painting','Kangra','Pahari, 18th century','Himachal','Krishna','Krishna Museum','Dance of Krishna','/images/11.jpg',2),
('SKM012','Krishna with Gopis','Painting','Madhubani','Modern','Bihar','Krishna','Krishna Museum','Folk art','/images/12.jpg',2),
('SKM013','Jagannatha Painting','Painting','Pattachitra','17th century','Odisha','Jagannatha','Krishna Museum','Traditional painting','/images/13.jpg',2),
('SKM014','Bhagavata Scene','Painting','Miniature','19th century','Himachal','Krishna','Krishna Museum','Krishna childhood','/images/14.jpg',2),
('SKM015','Mahabharata Battle','Painting','Mughal','16th century','Delhi','Krishna','Krishna Museum','Battle scene','/images/15.jpg',2),
('SKM053','Krishna with Rukmini and Satyabhama','Painting','Tanjore','Nayak, 17th century','Tamil Nadu','Krishna','Krishna Museum','Gold foil work','/images/53.jpg',2),
('SKM058','Kaliya Daman','Painting','Pahari','18th century','Himachal Pradesh','Krishna','Krishna Museum','Krishna vs serpent','/images/58.jpg',2),
('SKM051','Butter Theft','Painting','Miniature','Rajasthani','Rajasthan','Krishna','Krishna Museum','Butter stealing','/images/51.jpg',2),

('SKM016','Gita Manuscript','Inscription','Palm Leaf','13th century','Odisha','Krishna','Krishna Museum','Gita verses','/images/16.jpg',2),
('SKM017','Bhagavata Text','Inscription','Palm Leaf','14th century','Kerala','Vishnu','Krishna Museum','Scripture','/images/17.jpg',2),
('SKM018','Stotra Manuscript','Inscription','Palm Leaf','12th century','Kashmir','Shiva','Krishna Museum','Hymns','/images/18.jpg',2),
('SKM019','Vishnu Sahasranama','Inscription','Stone','4th century','Mathura','Vishnu','Krishna Museum','Stone text','/images/19.jpg',2),
('SKM020','Land Grant','Inscription','Copper','8th century','Haryana','None','Krishna Museum','Grant','/images/20.jpg',2),
('SKM021','Vyutpatti Text','Inscription','Palm Leaf','15th century','Odisha','None','Krishna Museum','Grammar','/images/21.jpg',2),
('SKM022','Urdu Manuscript','Inscription','Palm Leaf','16th century','Punjab','None','Krishna Museum','Urdu','/images/22.jpg',2),
('SKM023','Persian Document','Inscription','Palm Leaf','17th century','Punjab','None','Krishna Museum','Persian','/images/23.jpg',2),
('SKM024','Braj Text','Inscription','Palm Leaf','14th century','Haryana','Krishna','Krishna Museum','Braj','/images/24.jpg',2),
('SKM025','Battle Reference','Inscription','Copper','6th century','Kurukshetra','None','Krishna Museum','Battle','/images/25.jpg',2),
('SKM049','Ashoka Edict','Inscription','Stone','Mauryan','Kurukshetra','None','Krishna Museum','Edict','/images/49.jpg',2),
('SKM054','Gurjara-Pratihara Land Grant','Inscription','Copper','9th century','Rajasthan','None','Krishna Museum','Village grant','/images/54.jpg',2),
('SKM059','Bengali Gita Manuscript','Inscription','Palm Leaf','15th century','Bengal','Krishna','Krishna Museum','Gita Bengali','/images/59.jpg',2),

-- FLOOR 3 (COINS + RITUAL OBJECTS)
('SKM026','Garuda Coin','Coin','Gold','Gupta','Bihar','Garuda','Krishna Museum','Gold coin','/images/26.jpg',3),
('SKM027','Kanishka Coin','Coin','Silver','Kushana','Mathura','None','Krishna Museum','Silver coin','/images/27.jpg',3),
('SKM028','Punch Mark Coin','Coin','Copper','Mauryan','Pataliputra','None','Krishna Museum','Ancient coin','/images/28.jpg',3),
('SKM029','Archer Coin','Coin','Gold','Gupta','UP','None','Krishna Museum','Archer king','/images/29.jpg',3),
('SKM030','Indo Greek Coin','Coin','Silver','Indo-Greek','Taxila','Greek','Krishna Museum','Fusion coin','/images/30.jpg',3),
('SKM031','Nandi Coin','Coin','Copper','Harsha','Kurukshetra','Shiva','Krishna Museum','Nandi symbol','/images/31.jpg',3),
('SKM032','Elephant Coin','Coin','Lead','Satavahana','Deccan','Elephant','Krishna Museum','Elephant coin','/images/32.jpg',3),
('SKM033','Balakrishna Coin','Coin','Gold','Vijayanagara','Karnataka','Krishna','Krishna Museum','Infant Krishna','/images/33.jpg',3),
('SKM034','Akbar Coin','Coin','Silver','Mughal','Delhi','None','Krishna Museum','Rupee','/images/34.jpg',3),
('SKM035','Yaksha Coin','Coin','Copper','Post-Mauryan','Mathura','Yaksha','Krishna Museum','Yaksha coin','/images/35.jpg',3),
('SKM055','Krishna Vasudeva Coin','Coin','Copper','Indo-Scythian','Mathura','Krishna','Krishna Museum','Early Krishna coin','/images/55.jpg',3),

('SKM036','Mother Goddess','Ritual Object','Terracotta','Indus Valley','Rakhigarhi','Mother Goddess','Krishna Museum','Ancient idol','/images/36.jpg',3),
('SKM037','Diya','Ritual Object','Terracotta','Mauryan','Kurukshetra','None','Krishna Museum','Oil lamp','/images/37.jpg',3),
('SKM038','Temple Bell','Ritual Object','Bronze','Medieval','India','None','Krishna Museum','Bell','/images/38.jpg',3),
('SKM039','Incense Burner','Ritual Object','Brass','Mughal','Punjab','None','Krishna Museum','Fragrance','/images/39.jpg',3),
('SKM040','Pottery Vessel','Ritual Object','Clay','Indus Valley','Rakhigarhi','None','Krishna Museum','Decorated vessel','/images/40.jpg',3),
('SKM041','Votive Figurine','Ritual Object','Terracotta','Gupta','Mathura','Vishnu','Krishna Museum','Offering','/images/41.jpg',3),
('SKM042','Krishna Idol','Ritual Object','Ivory','Mughal','Punjab','Krishna','Krishna Museum','Personal idol','/images/42.jpg',3),
('SKM043','Lakshmi Plaque','Ritual Object','Terracotta','Kushana','Mathura','Lakshmi','Krishna Museum','Household worship','/images/43.jpg',3),
('SKM044','Deepa Lamp','Ritual Object','Bronze','Chola','Tamil Nadu','None','Krishna Museum','Temple lamp','/images/44.jpg',3),
('SKM045','Durga Idol','Ritual Object','Clay','Medieval','Bengal','Durga','Krishna Museum','Durga idol','/images/45.jpg',3),
('SKM048','Wood Panel','Ritual Object','Wood','Medieval','Kerala','Krishna','Krishna Museum','Carved panel','/images/48.jpg',3),
('SKM050','Naga Tablet','Ritual Object','Terracotta','Post-Gupta','Haryana','Naga','Krishna Museum','Serpent worship','/images/50.jpg',3),
('SKM056','Ceremonial Conch','Ritual Object','Shell','Medieval','Odisha','Vishnu','Krishna Museum','Conch shell','/images/56.jpg',3),
('SKM060','Processional Chakra','Ritual Object','Silver-plated metal','Maratha','Maharashtra','Vishnu','Krishna Museum','Festival chakra','/images/60.jpg',3);

-- =========================
-- VIEWS
-- =========================

CREATE VIEW krishna_artefacts AS
SELECT * FROM artefact WHERE deity LIKE '%Krishna%';

CREATE VIEW artefact_stats AS
SELECT type, COUNT(*) AS total FROM artefact GROUP BY type;

-- =========================
-- STORED PROCEDURES
-- =========================

DELIMITER $$

CREATE PROCEDURE getArtefactsByType(IN t VARCHAR(50))
BEGIN
    SELECT * FROM artefact WHERE type = t;
END$$

CREATE PROCEDURE searchArtefacts(IN keyword VARCHAR(100))
BEGIN
    SELECT * FROM artefact
    WHERE name LIKE CONCAT('%', keyword, '%')
    OR deity LIKE CONCAT('%', keyword, '%')
    OR dynasty LIKE CONCAT('%', keyword, '%')
    OR material LIKE CONCAT('%', keyword, '%');
END$$

DELIMITER ;

-- =========================
-- ANALYTICS QUERY
-- =========================

SELECT dynasty, COUNT(*) AS total
FROM artefact
GROUP BY dynasty
ORDER BY total DESC;

-- =========================
-- SAMPLE EVENTS
-- =========================

INSERT INTO event (title, description, event_date, location, category, image_url, capacity, registered)
VALUES 
('Ancient Manuscripts Workshop', 'Learn about ancient palm leaf manuscripts and their preservation techniques. Expert historians will guide you through the process of reading Sanskrit and Tamil manuscripts from our collection.', '2026-10-15', 'Krishna Museum Conference Hall', 'Workshop', '/images/event2.jpg', 50, 28),
('Kurukshetra Heritage Autumn Exhibition', 'Explore the rich history of Kurukshetra through sculptures, paintings, and artifacts spanning centuries. This special exhibition showcases the spiritual significance of the battlefield and Krishna\'s role in Indian culture.', '2026-10-28', 'Krishna Museum Gallery Wing', 'Exhibition', '/images/event3.jpg', 300, 120),
('Bhagavad Gita Lecture Series', 'Distinguished scholars present interpretations of the Bhagavad Gita\'s philosophical teachings. Discover the wisdom of Krishna\'s guidance to Arjuna and its relevance in modern times.', '2026-11-20', 'Krishna Museum Auditorium', 'Lecture', '/images/event4.jpg', 150, 67),
('Sri Krishna Winter Cultural Celebration', 'Join us for a grand celebration with devotional music, dance performances, and sacred rituals. Experience traditional Krishna bhajans and folk dances showcasing Krishna\'s divine pastimes.', '2026-12-25', 'Krishna Museum Main Hall', 'Cultural Program', '/images/event1.jpg', 200, 45);

