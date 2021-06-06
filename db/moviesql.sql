CREATE TABLE public.movies
(
    name character varying,
    id character varying,
    gen character varying,
    mood character varying
);
CREATE TABLE public.tokens
(
    email character varying,
    token character varying
);
CREATE TABLE public.trakt_tokens
(
    email character varying,
    trakt_token character varying,
    refresh_token character varying
);
CREATE TABLE public.users
(
    email character varying,
    username character varying,
    password character varying,
    salt character varying,
    PRIMARY KEY (email)
);
CREATE TABLE public.users_movies
(
    email character varying,
    title character varying,
    id character varying,
    PRIMARY KEY (id, email)
);
CREATE TABLE public.google_tokens
(
    email character varying,
    google_token character varying
);
--musical
INSERT INTO movies VALUES ('La La Land','tt3783958','musical','lonely');
INSERT INTO movies VALUES ('Singin'' in the Rain','tt0045152','musical','romantic');
INSERT INTO movies VALUES ('The Greatest Showman','tt1485796','musical','demotivated');
INSERT INTO movies VALUES ('Moulin Rouge!','tt0203009','musical','romantic');
INSERT INTO movies VALUES ('The Rocky Horror Picture Show','tt0073629','musical','');

--war
INSERT INTO movies VALUES ('1917','tt8579674','war','demotivated');
INSERT INTO movies VALUES ('Mudbound','tt2396589','war','sad');
INSERT INTO movies VALUES ('Miracle at St. Anna','tt1046997','war','demotivated');
INSERT INTO movies VALUES ('American Sniper','tt2179136','war','fearless');
INSERT INTO movies VALUES ('Fury','tt2713180','war','fearless');
INSERT INTO movies VALUES ('Inglourious Basterds','tt0361748','war','fearless');

--horror
INSERT INTO movies VALUES ('It Follows','tt3235888','horror','fearless');
INSERT INTO movies VALUES ('Friday the 13th','tt0758746','horror','fearless');
INSERT INTO movies VALUES ('The Exorcist','tt0070047','horror','fearless');
INSERT INTO movies VALUES ('Get Out','tt5052448','horror','fearless');
INSERT INTO movies VALUES ('Hostel','tt0450278','horror','fearless');
INSERT INTO movies VALUES ('Personal Shopper','tt4714782','horror','fearless');

--comedy
INSERT INTO movies VALUES ('The Big Lebowski','tt0118715','comedy','happy');
INSERT INTO movies VALUES ('Singin'' in the Rain','tt0045152','comedy','romantic');
INSERT INTO movies VALUES ('The Rocky Horror Picture Show','tt0073629','comedy','');
INSERT INTO movies VALUES ('50 First Dates','tt0343660','comedy','happy');
INSERT INTO movies VALUES ('I Can Quit Whenever I Want','tt3438354','comedy','happy');
INSERT INTO movies VALUES ('Three Men and a Leg','tt0135007','comedy','happy');
INSERT INTO movies VALUES ('Breakfast at Tiffany''s','tt0054698','comedy','romantic');
INSERT INTO movies VALUES ('Knives Out','tt8946378','comedy','curious');
INSERT INTO movies VALUES ('Shrek','tt0126029','comedy','lonely');
INSERT INTO movies VALUES ('The Ballad of Buster Scruggs','tt6412452','comedy','happy');
INSERT INTO movies VALUES ('Back to the Future','tt0088763','comedy','happy');

--drama
INSERT INTO movies VALUES ('Hachikô monogatari','tt0093132','drama','sad');
INSERT INTO movies VALUES ('Bad Tales','tt8526370','drama','sad');
INSERT INTO movies VALUES ('Collateral Beauty','tt4682786','drama','demotivated');
INSERT INTO movies VALUES ('The Florida Project','tt5649144','drama','demotivated');
INSERT INTO movies VALUES ('La La Land','tt3783958','drama','lonely');
INSERT INTO movies VALUES ('The Greatest Showman','tt1485796','drama','demotivated');
INSERT INTO movies VALUES ('Moulin Rouge!','tt0203009','drama','romantic');
INSERT INTO movies VALUES ('1917','tt8579674','drama','demotivated');
INSERT INTO movies VALUES ('Mudbound','tt2396589','drama','sad');
INSERT INTO movies VALUES ('The Iron Lady','tt1007029','drama','demotivated');
INSERT INTO movies VALUES ('One Day','tt1563738','drama','romantic');
INSERT INTO movies VALUES ('Call Me by Your Name','tt5726616','drama','romantic');
INSERT INTO movies VALUES ('(500) Days of Summer','tt1022603','drama','romantic');
INSERT INTO movies VALUES ('Murder on the Orient Express','tt3402236','drama','curious');
INSERT INTO movies VALUES ('Zodiac','tt0443706','drama','curious');
INSERT INTO movies VALUES ('Der Himmel über Berlin','tt0093191','drama','sad');
INSERT INTO movies VALUES ('Knives Out','tt8946378','drama','curious');
INSERT INTO movies VALUES ('Rear window','tt0166322','drama','curious');
INSERT INTO movies VALUES ('Miracle at St. Anna','tt1046997','drama','demotivated');
INSERT INTO movies VALUES ('American Sniper','tt2179136','drama','fearless');
INSERT INTO movies VALUES ('Fury','tt2713180','drama','fearless');

--romance
INSERT INTO movies VALUES ('(500) Days of Summer','tt1022603','romance','romantic');
INSERT INTO movies VALUES ('Her','tt1798709','romance','lonely');
INSERT INTO movies VALUES ('Call Me by Your Name','tt5726616','romance','romantic');
INSERT INTO movies VALUES ('One Day','tt1563738','romance','romantic');
INSERT INTO movies VALUES ('Breakfast at Tiffany''s','tt0054698','romance','romantic');
INSERT INTO movies VALUES ('La La Land','tt3783958','romance','lonely');
INSERT INTO movies VALUES ('Singin'' in the Rain','tt0045152','romance','romantic');
INSERT INTO movies VALUES ('Moulin Rouge!','tt0203009','romance','romantic');
INSERT INTO movies VALUES ('Collateral Beauty','tt4682786','romance','demotivated');
INSERT INTO movies VALUES ('50 First Dates','tt0343660','romance','happy');

--crime
INSERT INTO movies VALUES ('Zodiac','tt0443706','crime','curious');
INSERT INTO movies VALUES ('Murder on the Orient Express','tt3402236','crime','curious');
INSERT INTO movies VALUES ('Knives Out','tt8946378','crime','curious');
INSERT INTO movies VALUES ('Rear window','tt0166322','crime','curious');
INSERT INTO movies VALUES ('Personal Shopper','tt4714782','crime','fearless');
INSERT INTO movies VALUES ('The Big Lebowski','tt0118715','crime','happy');
INSERT INTO movies VALUES ('Die Hard','tt0095016','crime','curious');
INSERT INTO movies VALUES ('Kill Bill: - Vol. 1','tt0266697','crime','demotivated');

--action
INSERT INTO movies VALUES ('Inglourious Basterds','tt0361748','action','fearless');
INSERT INTO movies VALUES ('Die Hard','tt0095016','action','curious');
INSERT INTO movies VALUES ('Kill Bill: - Vol. 1','tt0266697','action','demotivated');
INSERT INTO movies VALUES ('First Blood','tt0083944','action','fearless');
INSERT INTO movies VALUES ('American Sniper','tt2179136','action','fearless');
INSERT INTO movies VALUES ('Fury','tt2713180','action','fearless');
INSERT INTO movies VALUES ('Iron Man','tt0371746','action','happy');
INSERT INTO movies VALUES ('Thor','tt0800369','action','happy');

--fantasy
INSERT INTO movies VALUES ('Harry Potter and the Philosopher''s Stone','tt0241527','fantasy','happy');
INSERT INTO movies VALUES ('Star Wars','tt0076759','fantasy','happy');
INSERT INTO movies VALUES ('Thor','tt0800369','fantasy','happy');
INSERT INTO movies VALUES ('Der Himmel über Berlin','tt0093191','fantasy','sad');
INSERT INTO movies VALUES ('Personal Shopper','tt4714782','fantasy','fearless');


--adventure
INSERT INTO movies VALUES ('Into the Wild','tt0758758','adventure','sad');
INSERT INTO movies VALUES ('Into the Wild','tt0758758','drama','sad');
INSERT INTO movies VALUES ('X-Men','tt0120903','action','happy');
INSERT INTO movies VALUES ('X-Men','tt0120903','adventure','happy');
INSERT INTO movies VALUES ('Iron Man','tt0371746','adventure','happy');
INSERT INTO movies VALUES ('Casino Royale','tt0381061','adventure','happy');
INSERT INTO movies VALUES ('Casino Royale','tt0381061','action','happy');
INSERT INTO movies VALUES ('Raiders of the Lost Ark','tt0082971','adventure','happy');
INSERT INTO movies VALUES ('Raiders of the Lost Ark','tt0082971','action','happy');
INSERT INTO movies VALUES ('Shrek','tt0126029','adventure','lonely');
INSERT INTO movies VALUES ('First Blood','tt0083944','adventure','fearless');
INSERT INTO movies VALUES ('Harry Potter and the Philosopher''s Stone','tt0241527','adventure','happy');
INSERT INTO movies VALUES ('Star Wars','tt0076759','adventure','happy');
INSERT INTO movies VALUES ('Thor','tt0800369','adventure','happy');

--historical
INSERT INTO movies VALUES ('Malcolm X','tt0104797','historical','demotivated');
INSERT INTO movies VALUES ('Malcolm X','tt0104797','drama','demotivated');
INSERT INTO movies VALUES ('BlacKkKlansman','tt7349662','historical','curious');
INSERT INTO movies VALUES ('BlacKkKlansman','tt7349662','crime','curious');
INSERT INTO movies VALUES ('The Iron Lady','tt1007029','historical','demotivated');
INSERT INTO movies VALUES ('Hammamet','tt8615136','historical','curious');
INSERT INTO movies VALUES ('Hammamet','tt8615136','drama','curious');
INSERT INTO movies VALUES ('The Favourite','tt5083738','historical','curious');
INSERT INTO movies VALUES ('The Favourite','tt5083738','historical','curious');
INSERT INTO movies VALUES ('Mudbound','tt2396589','historical','sad');
INSERT INTO movies VALUES ('Miracle at St. Anna','tt1046997','historical','demotivated');

--sci_fi
INSERT INTO movies VALUES ('Alien','tt0078748','sci_fi','fearless');
INSERT INTO movies VALUES ('Alien','tt0078748','horror','fearless');
INSERT INTO movies VALUES ('Star Trek','tt0796366','sci_fi','happy');
INSERT INTO movies VALUES ('Star Trek','tt0796366','adventure','happy');
INSERT INTO movies VALUES ('Stargate','tt0111282','sci_fi','');
INSERT INTO movies VALUES ('Stargate','tt0111282','adventure','');
INSERT INTO movies VALUES ('The Matrix','tt0133093','sci_fi','');
INSERT INTO movies VALUES ('The Matrix','tt0133093','action','');
INSERT INTO movies VALUES ('Back to the Future','tt0088763','sci_fi','happy');

--western
INSERT INTO movies VALUES ('Dances with Wolves','tt0099348','western','demotivated');
INSERT INTO movies VALUES ('Dances with Wolves','tt0099348','war','demotivated');
INSERT INTO movies VALUES ('The Ballad of Buster Scruggs','tt6412452','western','happy');
INSERT INTO movies VALUES ('The Ballad of Buster Scruggs','tt6412452','musical','happy');
INSERT INTO movies VALUES ('The Sisters Brothers','tt4971344','western','lonely');
INSERT INTO movies VALUES ('The Sisters Brothers','tt4971344','drama','lonely');
INSERT INTO movies VALUES ('A Fistful of Dollars','tt0058461','western','');
INSERT INTO movies VALUES ('A Fistful of Dollars','tt0058461','drama','');

--documentary
INSERT INTO movies VALUES ('Super Size Me','tt0390521','documentary','curious');
INSERT INTO movies VALUES ('Born in China','tt8923482','documentary','curious');
INSERT INTO movies VALUES ('The Four Times','tt1646975','documentary','lonely');
INSERT INTO movies VALUES ('The Four Times','tt1646975','drama','lonely');
INSERT INTO movies VALUES ('Seaspiracy','tt14152756','documentary','curious');
INSERT INTO movies VALUES ('My Name is Francesco Totti','tt12142854','documentary','happy');