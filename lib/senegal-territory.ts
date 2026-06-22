/**
 * Découpage administratif du Sénégal
 * 14 Régions → Départements → Communes
 *
 * Source : Ministère de l'Intérieur / ANSD
 * Préparé pour intégration future avec Parse Server (classe `Territory`)
 */

export interface Commune {
    name: string;
}

export interface Department {
    name: string;
    communes: string[];
}

export interface Region {
    name: string;
    departments: Department[];
}

export const SENEGAL_TERRITORY: Region[] = [
    {
        name: "Dakar",
        departments: [
            {
                name: "Dakar",
                communes: [
                    "Plateau", "Médina", "Grand Dakar", "Biscuiterie", "Hann Bel-Air",
                    "Dieuppeul-Derklé", "Fann-Point E-Amitié", "Gueule Tapée-Fass-Colobane",
                    "Gorée", "Ouakam", "Ngor", "Yoff", "Mermoz-Sacré Cœur", "Grand Yoff",
                    "Parcelles Assainies", "Patte d'Oie", "Cambérène", "HLM",
                    "Sicap Liberté",
                ],
            },
            {
                name: "Guédiawaye",
                communes: [
                    "Golf Sud", "Sam Notaire", "Ndiarème Limamoulaye",
                    "Wakhinane Nimzatt", "Médina Gounass",
                ],
            },
            {
                name: "Pikine",
                communes: [
                    "Pikine Nord", "Pikine Est", "Pikine Ouest",
                    "Dalifort", "Djiddah Thiaroye Kao", "Guinaw Rails Nord",
                    "Guinaw Rails Sud", "Thiaroye Gare", "Thiaroye sur Mer",
                    "Tivaouane Peulh-Niaga", "Diamaguène Sicap Mbao",
                    "Keur Massar Nord", "Keur Massar Sud", "Malika", "Yeumbeul Nord",
                    "Yeumbeul Sud",
                ],
            },
            {
                name: "Rufisque",
                communes: [
                    "Rufisque Nord", "Rufisque Est", "Rufisque Ouest",
                    "Bargny", "Diamniadio", "Sébikhotane", "Sendou",
                    "Bambylor", "Sangalkam", "Jaxaay-Parcelles-Niakoul Rab",
                ],
            },
        ],
    },
    {
        name: "Diourbel",
        departments: [
            {
                name: "Bambey",
                communes: [
                    "Bambey", "Dinguiraye", "Kaba", "Lambaye", "Ngoye",
                    "Ndondol", "Réfane", "Thiakhar",
                ],
            },
            {
                name: "Diourbel",
                communes: [
                    "Diourbel", "Ndoulo", "Ndindy", "Tocky Gare", "Pattar",
                    "Keur Ngalgou",
                ],
            },
            {
                name: "Mbacké",
                communes: [
                    "Touba Mosquée", "Mbacké", "Dalla Ngabou",
                    "Madina", "Taïf", "Ndame", "Touba Fall",
                    "Kael", "Sadio", "Dandeye",
                ],
            },
        ],
    },
    {
        name: "Fatick",
        departments: [
            {
                name: "Fatick",
                communes: [
                    "Fatick", "Diakhao", "Diarère", "Fimela",
                    "Loul Séssène", "Ndiob", "Niakhar", "Tattaguine",
                ],
            },
            {
                name: "Foundiougne",
                communes: [
                    "Foundiougne", "Karang Poste", "Keur Saloum Diané",
                    "Niodior", "Sokone", "Toubacouta", "Djilor",
                    "Diossong", "Passy",
                ],
            },
            {
                name: "Gossas",
                communes: [
                    "Gossas", "Colobane", "Mbar", "Ouadiour", "Patar",
                ],
            },
        ],
    },
    {
        name: "Kaffrine",
        departments: [
            {
                name: "Birkelane",
                communes: [
                    "Birkelane", "Diamagadio", "Keur Mboucki",
                    "Mabo", "Ndiognick", "Segré Gatta",
                ],
            },
            {
                name: "Kaffrine",
                communes: [
                    "Kaffrine", "Diamal", "Gniby", "Kathiotte",
                    "Kahi", "Nganda", "Boulel",
                ],
            },
            {
                name: "Koungheul",
                communes: [
                    "Koungheul", "Ida Mouride", "Lour Escale",
                    "Missirah Wadène", "Ribot Escale", "Saly Escale",
                ],
            },
            {
                name: "Malem Hodar",
                communes: [
                    "Malem Hodar", "Darou Minam", "Ndioum Ngainth",
                    "Sagna",
                ],
            },
        ],
    },
    {
        name: "Kaolack",
        departments: [
            {
                name: "Guinguinéo",
                communes: [
                    "Guinguinéo", "Mbadakhoune", "Ngathie Naoudé",
                    "Ourour", "Ndoffane",
                ],
            },
            {
                name: "Kaolack",
                communes: [
                    "Kaolack", "Kahone", "Keur Baka", "Latmingué",
                    "Ndoffane Laghem", "Ndiédieng", "Thiomby",
                    "Gandiaye", "Sibassor",
                ],
            },
            {
                name: "Nioro du Rip",
                communes: [
                    "Nioro du Rip", "Keur Madiabel", "Médina Sabakh",
                    "Paoskoto", "Wack Ngouna", "Kayemor",
                    "Gainthe Kaye", "Taïba Niassène",
                ],
            },
        ],
    },
    {
        name: "Kédougou",
        departments: [
            {
                name: "Kédougou",
                communes: [
                    "Kédougou", "Bandafassi", "Dindéfélo",
                    "Fongolimbi", "Ninéfécha", "Tomboronkoto",
                ],
            },
            {
                name: "Salémata",
                communes: [
                    "Salémata", "Dar Salam", "Ethiolo",
                    "Kévoye",
                ],
            },
            {
                name: "Saraya",
                communes: [
                    "Saraya", "Bembou", "Médina Baffé",
                    "Missirah Sirimana", "Sabodala",
                ],
            },
        ],
    },
    {
        name: "Kolda",
        departments: [
            {
                name: "Kolda",
                communes: [
                    "Kolda", "Bagadadji", "Dialambéré",
                    "Guiro Yéro Bocar", "Mampatim", "Médina El Hadj",
                    "Salikégné", "Tankanto Escale", "Dabo",
                    "Thietty", "Coumbacara",
                ],
            },
            {
                name: "Médina Yoro Foulah",
                communes: [
                    "Médina Yoro Foulah", "Badion", "Bourouco",
                    "Fafacourou", "Kéréwane", "Ndorna",
                    "Niaming", "Pata",
                ],
            },
            {
                name: "Vélingara",
                communes: [
                    "Vélingara", "Bonconto", "Diaobé-Kabendou",
                    "Kandia", "Kounkané", "Linkéring",
                    "Médina Gounass", "Némataba", "Pakour",
                    "Paroumba", "Saré Coly Sallé", "Sinthiang Koundara",
                ],
            },
        ],
    },
    {
        name: "Louga",
        departments: [
            {
                name: "Kébémer",
                communes: [
                    "Kébémer", "Darou Mousty", "Guéoul",
                    "Ndande", "Sam Yabal", "Sagatta Guet",
                    "Touba Mérina", "Thieppe",
                ],
            },
            {
                name: "Linguère",
                communes: [
                    "Linguère", "Barkedji", "Boulal",
                    "Dahra", "Dodji", "Gassane",
                    "Kamb", "Mbeuleukhé", "Sagatta Djoloff",
                    "Thiargny", "Yang Yang",
                ],
            },
            {
                name: "Louga",
                communes: [
                    "Louga", "Coki", "Gande",
                    "Guet Ardo", "Kelle Gueye", "Léona",
                    "Mbédiène", "Nger Malal", "Niomré",
                    "Nguidjilone", "Sakal", "Pete Ouarack",
                ],
            },
        ],
    },
    {
        name: "Matam",
        departments: [
            {
                name: "Kanel",
                communes: [
                    "Kanel", "Dembancané", "Hamady Ounaré",
                    "Ogo", "Orkadière", "Semmé",
                    "Waooundé", "Ndendory",
                ],
            },
            {
                name: "Matam",
                communes: [
                    "Matam", "Agnam Civol", "Nabadji Civol",
                    "Oréfondé", "Ourossogui", "Thilogne",
                    "Nguidjilone", "Ranerou Ferlo",
                ],
            },
            {
                name: "Ranérou",
                communes: [
                    "Ranérou", "Lougré Thioly", "Oudalaye",
                    "Vélingara Ferlo",
                ],
            },
        ],
    },
    {
        name: "Saint-Louis",
        departments: [
            {
                name: "Dagana",
                communes: [
                    "Dagana", "Richard Toll", "Ross Béthio",
                    "Rosso Sénégal", "Bokhol", "Gaé",
                    "Gnith", "Mbane", "Ndiaye", "Ronkh",
                ],
            },
            {
                name: "Podor",
                communes: [
                    "Podor", "Aéré Lao", "Boki Dialloubé",
                    "Dodel", "Gamadji Saré", "Galoya Toucouleur",
                    "Guédé Village", "Madina Ndiathbe",
                    "Mboumba", "Mbolo Birane", "Ndiayène Pendao",
                    "Niandane", "Walaldé", "Pete",
                ],
            },
            {
                name: "Saint-Louis",
                communes: [
                    "Saint-Louis", "Gandon", "Fass Ngom",
                    "Mpal", "Ndiébène Gandiol",
                ],
            },
        ],
    },
    {
        name: "Sédhiou",
        departments: [
            {
                name: "Bounkiling",
                communes: [
                    "Bounkiling", "Boghal", "Bona",
                    "Diacounda", "Diaroumé", "Inor",
                    "Ndiamacouta", "Tankon",
                ],
            },
            {
                name: "Goudomp",
                communes: [
                    "Goudomp", "Djibanar", "Kaour",
                    "Mangaroungou Santo", "Niagha",
                    "Simbandi Balante", "Simbandi Brassou",
                    "Tanaff", "Yarang Balante",
                ],
            },
            {
                name: "Sédhiou",
                communes: [
                    "Sédhiou", "Bambali", "Djibabouya",
                    "Djiredji", "Koussy", "Marsassoum",
                    "Sama Kanta Peulh", "Sakar",
                ],
            },
        ],
    },
    {
        name: "Tambacounda",
        departments: [
            {
                name: "Bakel",
                communes: [
                    "Bakel", "Bala", "Diawara",
                    "Gabou", "Goudiry", "Kéniéba",
                    "Kidira", "Moudéry", "Sadatou",
                ],
            },
            {
                name: "Goudiry",
                communes: [
                    "Goudiry", "Bala", "Boynguel Bamba",
                    "Dougue", "Goumbayel", "Koulor",
                    "Koussan", "Sinthiou Mamadou Boubou",
                    "Tourécounda",
                ],
            },
            {
                name: "Koumpentoum",
                communes: [
                    "Koumpentoum", "Bamba Thialène",
                    "Kahène", "Kouthia Gayé", "Malem Niani",
                    "Mereto", "Ndoga Babacar", "Payar",
                ],
            },
            {
                name: "Tambacounda",
                communes: [
                    "Tambacounda", "Dialakoto", "Koussanar",
                    "Missirah", "Nétéboulou",
                    "Ndoga", "Sinthiou Malème",
                ],
            },
        ],
    },
    {
        name: "Thiès",
        departments: [
            {
                name: "Mbour",
                communes: [
                    "Mbour", "Joal-Fadiouth", "Fissel",
                    "Malicounda", "Ndiaganiao", "Nguékhokh",
                    "Saly Portudal", "Sindia", "Somone",
                    "Ngaparou", "Popenguine-Ndayane",
                    "Sessène", "Sandiara", "Tattaguine",
                ],
            },
            {
                name: "Thiès",
                communes: [
                    "Thiès Nord", "Thiès Est", "Thiès Ouest",
                    "Cayar", "Diender Guedj", "Fandène",
                    "Keur Moussa", "Khombole", "Ndieyène Sirakh",
                    "Pout", "Tassette", "Touba Toul",
                ],
            },
            {
                name: "Tivaouane",
                communes: [
                    "Tivaouane", "Mboro", "Mékhé",
                    "Méouane", "Darou Khoudoss", "Mont Rolland",
                    "Ndande", "Niakhène", "Notto Diobass",
                    "Pambal", "Pire Gouréye", "Thilmakha",
                    "Chérif Lô",
                ],
            },
        ],
    },
    {
        name: "Ziguinchor",
        departments: [
            {
                name: "Bignona",
                communes: [
                    "Bignona", "Diégoune", "Djinaky",
                    "Kafountine", "Kataba 1", "Mangagoulack",
                    "Mlomp", "Niamone", "Ouonck",
                    "Sindian", "Tenghory", "Thionck Essyl",
                ],
            },
            {
                name: "Oussouye",
                communes: [
                    "Oussouye", "Diembéring", "Mlomp",
                    "Oukout", "Santhiaba Manjacque",
                ],
            },
            {
                name: "Ziguinchor",
                communes: [
                    "Ziguinchor", "Adéane", "Boutoupa Camaracounda",
                    "Enampor", "Niaguis", "Niassia",
                ],
            },
        ],
    },
];
