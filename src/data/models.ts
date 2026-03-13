export const VehicleCategories = ['SUV', 'Sedán', 'Hatchback', 'Pick-Up'] as const;
export type CategoryTuple = typeof VehicleCategories[number];

export interface Vehicle {
    // UI Metadata & Identifiers
    id: string;
    brand: string;
    model: string;
    category: CategoryTuple;
    price: number;
    image: string;
    stockStatus: 'EN STOCK' | 'PREVENTA' | 'POR PEDIDO';
    
    // DB Specifications Mapping
    trim_id: string;
    battery_kwh: number;
    range_cltc_km: number;
    range_wltp_km: number;
    horsepower: number;
    torque: number;
    zero_to_100: number;
    top_speed: number;
    charge_time_30_80: string;
    trunk_liters: number;
    length_mm: number;
    width_mm: number;
    height_mm: number;
    wheelbase_mm: number;
    curb_weight_kg: number;
    software_version: string;
    adas_level: string;
    screen_size: string;
    kwh_per_100km: number;
}

export const vehiclesData: Vehicle[] = [
    {
        id: 'avatr-11',
        brand: 'AVATR',
        model: '11',
        category: 'SUV',
        price: 59900,
        image: '/MODELOS/AVATR-11.avif',
        stockStatus: 'EN STOCK',
        
        trim_id: 'trim_avatr_11_awd',
        battery_kwh: 83,
        range_cltc_km: 700,
        range_wltp_km: 610,
        horsepower: 578,
        torque: 650,
        zero_to_100: 3.9,
        top_speed: 200,
        charge_time_30_80: '25 min',
        trunk_liters: 450,
        length_mm: 4880,
        width_mm: 1970,
        height_mm: 1601,
        wheelbase_mm: 2975,
        curb_weight_kg: 2280,
        software_version: 'HarmonyOS 4',
        adas_level: 'Huawei ADS 2.0',
        screen_size: '15.6"',
        kwh_per_100km: 15.6
    },
    {
        id: 'bmw-ix1',
        brand: 'BMW',
        model: 'iX1',
        category: 'SUV',
        price: 65900,
        image: '/MODELOS/BMW IX1.avif',
        stockStatus: 'PREVENTA',
        
        trim_id: 'trim_bmw_ix1_xdrive30',
        battery_kwh: 64.7,
        range_cltc_km: 440,
        range_wltp_km: 440,
        horsepower: 313,
        torque: 494,
        zero_to_100: 5.6,
        top_speed: 180,
        charge_time_30_80: '29 min',
        trunk_liters: 490,
        length_mm: 4500,
        width_mm: 1845,
        height_mm: 1616,
        wheelbase_mm: 2692,
        curb_weight_kg: 2085,
        software_version: 'iDrive 8',
        adas_level: 'Driving Assistant Plus',
        screen_size: '10.7"',
        kwh_per_100km: 17.3
    },
    {
        id: 'byd-bao-3',
        brand: 'BYD',
        model: 'BAO 3',
        category: 'SUV',
        price: 45000,
        image: '/MODELOS/BYD BAO_3.webp',
        stockStatus: 'POR PEDIDO',
        
        trim_id: 'trim_byd_bao_3',
        battery_kwh: 78.7,
        range_cltc_km: 501,
        range_wltp_km: 450,
        horsepower: 422,
        torque: 550,
        zero_to_100: 4.9,
        top_speed: 201,
        charge_time_30_80: '30 min',
        trunk_liters: 400,
        length_mm: 4600,
        width_mm: 1900,
        height_mm: 1720,
        wheelbase_mm: 2750,
        curb_weight_kg: 2150,
        software_version: 'DiLink 4.0',
        adas_level: 'DiPilot L2+',
        screen_size: '15.6"',
        kwh_per_100km: 16.5
    },
    {
        id: 'byd-dolphin-knight',
        brand: 'BYD',
        model: 'DOLPHIN EDITION KNIGHT',
        category: 'Hatchback',
        price: 34900,
        image: '/MODELOS/BYD DOLPHIN EDITION KNIGHT.avif',
        stockStatus: 'EN STOCK',
        
        trim_id: 'trim_dolphin_knight',
        battery_kwh: 44.9,
        range_cltc_km: 405,
        range_wltp_km: 427,
        horsepower: 177,
        torque: 290,
        zero_to_100: 7.5,
        top_speed: 150,
        charge_time_30_80: '30 min',
        trunk_liters: 345,
        length_mm: 4125,
        width_mm: 1770,
        height_mm: 1570,
        wheelbase_mm: 2700,
        curb_weight_kg: 1658,
        software_version: 'DiLink 3.0',
        adas_level: 'DiPilot Basic',
        screen_size: '12.8"',
        kwh_per_100km: 15.2
    },
    {
        id: 'byd-yuan-plus',
        brand: 'BYD',
        model: 'YUAN PLUS',
        category: 'SUV',
        price: 38900,
        image: '/MODELOS/BYD YUAN PLUS -.webp',
        stockStatus: 'EN STOCK',
        
        trim_id: 'trim_yuan_plus_gs',
        battery_kwh: 60.48,
        range_cltc_km: 510,
        range_wltp_km: 420,
        horsepower: 204,
        torque: 310,
        zero_to_100: 7.3,
        top_speed: 160,
        charge_time_30_80: '30 min',
        trunk_liters: 440,
        length_mm: 4455,
        width_mm: 1875,
        height_mm: 1615,
        wheelbase_mm: 2720,
        curb_weight_kg: 1690,
        software_version: 'DiLink 4.0',
        adas_level: 'DiPilot L2',
        screen_size: '12.8"',
        kwh_per_100km: 14.5
    },
    {
        id: 'byd-sealion-7',
        brand: 'BYD',
        model: 'SEALION 7',
        category: 'SUV',
        price: 52000,
        image: '/MODELOS/BYD-SEALION7 (1).avif',
        stockStatus: 'EN STOCK',
        
        trim_id: 'trim_sealion_7_awd',
        battery_kwh: 82.5,
        range_cltc_km: 610,
        range_wltp_km: 550,
        horsepower: 523,
        torque: 690,
        zero_to_100: 4.5,
        top_speed: 225,
        charge_time_30_80: '25 min',
        trunk_liters: 500,
        length_mm: 4830,
        width_mm: 1925,
        height_mm: 1620,
        wheelbase_mm: 2930,
        curb_weight_kg: 2330,
        software_version: 'DiLink 5.0',
        adas_level: 'DiPilot Advanced',
        screen_size: '15.6"',
        kwh_per_100km: 16.8
    },
    {
        id: 'byd-seagull',
        brand: 'BYD',
        model: 'SEAGULL',
        category: 'Hatchback',
        price: 21900,
        image: '/MODELOS/BYD-Seagull.webp',
        stockStatus: 'EN STOCK',
        
        trim_id: 'trim_seagull_fly',
        battery_kwh: 38.8,
        range_cltc_km: 405,
        range_wltp_km: 300,
        horsepower: 74,
        torque: 135,
        zero_to_100: 13.0,
        top_speed: 130,
        charge_time_30_80: '30 min',
        trunk_liters: 230,
        length_mm: 3780,
        width_mm: 1715,
        height_mm: 1540,
        wheelbase_mm: 2500,
        curb_weight_kg: 1160,
        software_version: 'DiLink 3.0',
        adas_level: 'Cruise Control',
        screen_size: '10.1"',
        kwh_per_100km: 10.5
    },
    {
        id: 'geely-galaxy-e8',
        brand: 'GEELY',
        model: 'GALAXY E8',
        category: 'Sedán',
        price: 49900,
        image: '/MODELOS/GALAXY_E8.avif',
        stockStatus: 'PREVENTA',
        
        trim_id: 'trim_galaxy_e8_awd',
        battery_kwh: 76,
        range_cltc_km: 665,
        range_wltp_km: 620,
        horsepower: 646,
        torque: 710,
        zero_to_100: 3.49,
        top_speed: 210,
        charge_time_30_80: '18 min',
        trunk_liters: 465,
        length_mm: 5010,
        width_mm: 1920,
        height_mm: 1465,
        wheelbase_mm: 2925,
        curb_weight_kg: 2030,
        software_version: 'Galaxy OS',
        adas_level: 'Galaxy L2++',
        screen_size: '45"',
        kwh_per_100km: 14.1
    },
    {
        id: 'vw-id3-outstanding',
        brand: 'VOLKSWAGEN',
        model: 'ID.3 OUTSTANDING',
        category: 'Hatchback',
        price: 36900,
        image: '/MODELOS/Volkswagen- ID3 OUTSTANGING.webp',
        stockStatus: 'POR PEDIDO',
        
        trim_id: 'trim_id3_pro_s',
        battery_kwh: 58,
        range_cltc_km: 450,
        range_wltp_km: 420,
        horsepower: 204,
        torque: 310,
        zero_to_100: 7.3,
        top_speed: 160,
        charge_time_30_80: '35 min',
        trunk_liters: 385,
        length_mm: 4261,
        width_mm: 1809,
        height_mm: 1568,
        wheelbase_mm: 2770,
        curb_weight_kg: 1815,
        software_version: 'ID. Software 3.5',
        adas_level: 'IQ.DRIVE',
        screen_size: '12"',
        kwh_per_100km: 15.3
    },
    {
        id: 'byd-yuan-up',
        brand: 'BYD',
        model: 'YUAN UP',
        category: 'SUV',
        price: 28900,
        image: '/MODELOS/YUANUPBYD (1).avif',
        stockStatus: 'EN STOCK',
        
        trim_id: 'trim_yuan_up_400',
        battery_kwh: 45.1,
        range_cltc_km: 401,
        range_wltp_km: 380,
        horsepower: 177,
        torque: 290,
        zero_to_100: 7.9,
        top_speed: 160,
        charge_time_30_80: '30 min',
        trunk_liters: 380,
        length_mm: 4310,
        width_mm: 1830,
        height_mm: 1675,
        wheelbase_mm: 2620,
        curb_weight_kg: 1430,
        software_version: 'DiLink 4.0',
        adas_level: 'DiPilot Basic',
        screen_size: '12.8"',
        kwh_per_100km: 14.2
    }
];
