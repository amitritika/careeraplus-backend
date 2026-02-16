// scripts/initExams.js
require('dotenv').config();

const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');
const Exam = require('../src/models/exam');
async function initExams() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database successfully');

    // Clear existing exams
    await Exam.deleteMany({});
    console.log('Cleared existing exams');
    // GATE Exam Data
    const gateExamData = {
mechanical: {
    preparationTypes: [
      {
        name: "Complete GATE Preparation",
        slug: "complete-gate",
        description: "Complete GATE mechanical engineering preparation covering all subjects",
      subjectName: ["Eng Math", "Eng Mec", "SOM", "TOM", "MD", "FM", "HT", "Thermo", "RAC", "Manf", "IE"],
      subjectWeightage: [0.158088235294118,0.0654411705882,0.103676470588235,0.0926470588235294,0.0522058823529412,0.0977941176470588,0.0705882352941176,0.0963235294117647,0.0235294117647059,0.175735294117647,0.0639705882352941],
      subjectTopicsName: [ 
          ["Linear Algebra","Calculus", "Diffrential Equation", "Complex Variables", "Probablity and Statistics", "Numerical Method"],
          ["FBD, Equlibrium, Plane Trusses and Virtual Work", "Translation and Rotation", "Friction", "Impulse & Momentum, Impact and Work-Energy", "Plane Motion"],
          ["Stress and Strain", "SS Relationship and Elastic Constants", "Mohr's Circle", "Thin Cylinder", "Shear Force and Bending Moment Diagram", "Bending of Beams", "Torsion of Shafts", "Springs","Euler's Theory", "Strain Energy and Thermal Stresses"],
          ["Displacement, Velocity and Accelaration", "Planar Mechanicsms", "Cams", "Dynamic Analysis of Slider Cranck", "Gear and Gear Trains", "Flywheel", "Vibration", "Balancing", "Gyroscope"],
          ["Static, Dynamic Loading and failure Theories", "Fatigue Strength and S_N diagram", "Bolted riveted and Welded Joint", "Bearings, shafts and Keys", "Gears", "Brakes, clutches and Ropes"],
          ["Fluid Properties", "Fluid Statics", "Fluid Kinematics", "Fluid Dynamics", "Viscous, Turbulent Flow and Boundary layer Theory", "Flow Through Pipes", "Turbines and Pumps"],
          ["Conduction", "Free and Forced Convection", "Heat Transfer in flow over plates and Pipes", "Radiation", "Heat Exchanger", "Fins and Unsteady Heat Transfer"],
          ["Thermodynamics System and Process", "First law, Heat, work, and Energy", "Second law, Carnot Cycle and Entropy", "Availability and Irreversibility", "Pure Substances", "Power Systems(Rankine, Brayton etc.)", "IC Engine"],
          ["Vapor Refrigeration", "Psychometric Process", "Heat Pumps and Cycles", "Properties of Moist air"],
          ["Engineering materials", "Metal Casting", "Metal forming", "Sheet metal Operations", "Joining/Welding", "Machining and Machine Tool Operation", "Meteorology and Inspection", "CIMS", "Non Conv machining(EDM High energy Rate Forming)"],
          ["Forecasting", "Inventory Control", "Linear Programming", "PERT and CPM", "Probability and Statistics", "Products and Process, Planning and Control", "Queuing theory and Transportation"]
          ],
      subjectTopicsWeightage: [ [0.193181818181818,0.325757575757576,0.162878787878788,0.0757575757575758,0.136363636363636,0.106060606060606],
          [0.232323232323232,0.212121212121212,0.131313131313131,0.252525252525253,0.171717171717172],
          [0.158730158730159,0.158730158730159,0.0476190476190476,0.0476190476190476,0.0687830687830688,0.259259259259259,0.132275132275132,0.0317460317460317,0.0476190476190476,0.0476190476190476],
          [0.0747126436781609,0.252873563218391,0.0344827586206897,0.0459770114942529,0.137931034482759,0.0574712643678161,0.362068965517241,0.0229885057471264,0.0114942528735632],
          [0.192592592592593,0.0962962962962963,0.148148148148148,0.177777777777778,0.22962962962963,0.155555555555556],
          [0.0462962962962963,0.134259259259259,0.194444444444444,0.115740740740741,0.268518518518519,0.087962962962963,0.152777777777778],
          [0.296052631578947,0.0921052631578947,0.111842105263158,0.190789473684211,0.171052631578947,0.138157894736842],
          [0.0708661417322835,0.169291338582677,0.165354330708661,0.031496062992126,0.0826771653543307,0.311023622047244,0.169291338582677],
          [0.311475409836066,0.245901639344262,0.213114754098361,0.229508196721311],
          [0.0695652173913043,0.119565217391304,0.102173913043478,0.0608695652173913,0.106521739130435,0.254347826086956,0.1,0.0869565217391304,0.1],
          [0.137254901960784,0.183006535947712,0.163398692810458,0.209150326797386,0.0392156862745098,0.124183006535948,0.143790849673203]
          ]
        }
    ]
    },
    civil: {
        preparationTypes: [
      {
        name: "Complete GATE Preparation",
        slug: "complete-gate",
        description: "Complete GATE civil engineering preparation covering all subjects",
      subjectName:["Eng Math","SM","Struc Ana","RCC","Steel Str","Geo Tech","FM","Env Eng","Irrig Eng","Eng Hydr","Trans Eng","Geom Eng","CMM"],
      subjectWeightage:[0.13921568627451,0.0764705882352941,0.042156862745098,0.0647058823529412,0.0450980392156863,0.166666666666667,0.107843137254902,0.114705882352941,0.0225490196078431,0.0284313725490196,0.102941176470588,0.0607843137254902,0.0284313725490196],
      subjectTopicsName:[ 
        ["Linear Algebra","Calculus","Diffrential Equation","Complex Variables","Probablity and Statistics","Numerical Method","Laplace Transform","Fourier Transform"],
        ["Properties of Metals, Stress and Strain","Shear Force and Bending Moment","Principal Stress and Principal Strain","Bending and Shear Stresses","Deflection of Beams","Torsion of Shafts and Pressure Vessels","Theory of Columns and Shear Center"],
        ["Determinacy and Indeterminacy","Influence Line Diagram and Rolling Loads","Arches","Methods of Structural Analysis","Trusses","Matrix Method of Structural Analysis"],
        ["Working Stress & Limit Stste Method","Shear, Torsion, Bond, Anchorage, & Development Length","Footing, Columns, Beams and Slabs","Prestressed Concrete"],
        ["Structural Fasteners","Tension Member","Compression Member","Beams","Plate Girders and Industrial Roofs","Plastic Analysis"],
        ["Properties of Soil","Classification of Soils and Clay Minerals","Effective Stress and Permeability","Consolidation of Soils","Seepage Analysis","Compaction of Soil","Stress Distribution In the Soil","Shear Strength of Soil","Retaining Wall/ Earth Pressure Theories","Stability Analysis of Slopes","Shallow Foundation and Bearing Capacity","Deep Foundation","Soil Stabilization and Soil Exploration"],
        ["Fluid Properties and manometry","Hydrostatic Forces","Buoyancy and Floatation","Fluid Kinematics","Fluid Dynamics & Flow Measurement","Viscous Flow of Incompressible Fluid","Flow Through Pipes","Boundary layer Theory, Drag and Lift","Turbulent Flow","Dimesnsional Analysis","Impact of Jets and Turbines","Hydraulic Pumps","Open Channel Flow"],
        ["Water Demand","Quality Characterstics of Water","Water Treatment","Sources of Water Supply, Distribution System and Well Hydraulics","Design of Sewers and Sewerage System","Quality and Characterstics of Waster Water","Disposal of Sewage Effluents","Treatment of Waste Water","Municipal Solid Waster Management","Air and Noise Pollution"],
        ["Water Requirements of Crops","Design os Stable Channels","Design & Construction of Gravity Dams","Theories of Seepage, Spillways and Miscellaneous"],
        ["Percipitation of General Aspects of Hydrology","Evaporation and its Measurement","Infiltration, Runoff and Hydrographs","Floods, Flood Routing and Flood Control"],
        ["Highway Geometric Design & Planning","Traffic Enginnering","Highway Materials","Pavement Design","Highway maintenance","Railway & Airport Engineering"],
        ["Fundamental Concepts of Surveying","Theodilites, Compass and Traverse Surveying","Levelling and Contouring","Tacheometric, Curve and Hydroloraphic Surveying","Reamote Snsing, GIS, GPS and Photogrammetry"],
        ["Construction Materials","Construction Management","Engeenering Mechanics"]
        ],
      subjectTopicsWeightage:[ 
        [0.228956228956229,0.255892255892256,0.208754208754209,0.037037037037037,0.101010101010101,0.0707070707070707,0.0404040404040404,0.0572390572390572],
        [0.185185185185185,0.154320987654321,0.117283950617284,0.0740740740740741,0.277777777777778,0.0740740740740741,0.117283950617284],
        [0.212962962962963,0.138888888888889,0.0462962962962963,0.296296296296296,0.194444444444444,0.111111111111111],
        [0.446808510638298,0.120567375886525,0.283687943262411,0.148936170212766],
        [0.311926605504587,0.0917431192660551,0.137614678899083,0.110091743119266,0.055045871559633,0.293577981651376],
        [0.105978260869565,0.0842391304347826,0.0896739130434783,0.103260869565217,0.0869565217391304,0.0380434782608696,0.0217391304347826,0.0896739130434783,0.0815217391304348,0.0597826086956522,0.146739130434783,0.0733695652173913,0.0190217391304348],
        [0.0405405405405405,0.036036036036036,0.018018018018018,0.112612612612613,0.0765765765765766,0.027027027027027,0.126126126126126,0.0630630630630631,0.018018018018018,0.0675675675675676,0.0495495495495495,0.0495495495495495,0.315315315315315],
        [0.0116279069767442,0.197674418604651,0.193798449612403,0.0852713178294574,0.0310077519379845,0.135658914728682,0.0193798449612403,0.178294573643411,0.0232558139534884,0.124031007751938],
        [0.529411764705882,0.176470588235294,0.0588235294117647,0.235294117647059],
        [0.133333333333333,0.0666666666666667,0.577777777777778,0.222222222222222],
        [0.319634703196347,0.237442922374429,0.159817351598174,0.232876712328767,0.0319634703196347,0.0182648401826484],
        [0.0810810810810811,0.324324324324324,0.310810810810811,0.175675675675676,0.108108108108108],
        [0.318181818181818,0.272727272727273,0.409090909090909]
        ]
    }
    ]
    },
    
    electrical: {
        preparationTypes: [
      {
        name: "Complete GATE Preparation",
        slug: "complete-gate",
        description: "Complete GATE electrical engineering preparation covering all subjects",
      subjectName: ["Eng Math","Ele Cir","Sig& Sys","Ele Mac","Pow Sys","Con Sys","E&E Mea","Ana Cir","Dig Ele","Pow Ele","EM Fields"], // Added missing EM Fields subject
      subjectWeightage:[0.125133689839572,0.108021390374332,0.0898395721925134,0.14331550802139,0.117647058823529,0.102673796791444,0.0524064171122995,0.0545454545454545,0.0631016042780749,0.100534759358289,0.0427807486631016],
      subjectTopicsName:[ 
      ["Linear Algebra","Calculus","Diffrential Equation","Complex Variables","Probablity and Statistics","Numerical Method","Transform Theory"],
      ["KCL, KVL & Phasor Cal","Trans & Steady State Res","Graph Theory","Network Theorems","Two-Port Networks","Resonance","Miscellaneous"],
      ["Intro to CT & DT Signals","Linear Time Invariant Systems","Fourier Series","Fourier Transform","laplace Transform","Z-Transform"],
      ["DC machines","Transformers","Three Phase Induction Motor","Synchronous Machines","SPIM, Spec Pur machines"],
      ["Perf of Trans Lines, Para & Corona","Compen Tech & Vol Pofile Con","Dist Sys, Cabels & Insulators","Eco Pow Gen & Load Dispatch","Fault Analysis","Power System Stability","Switch Gear and Protection","Generating Power Stations","Load Flow Studies","High Voltage DV Transmission","Per Unit System","Power System Transients"],
      ["Math Model of Phy Sys","Feedback Char of Con Sys","Time Response Analysis","Concepts of Stability","Root Locus Techniques","Frequency Response Analysis","Design of Control Systems","State variable Analysis"],
      ["Chara of Inst & Meas Sys","Galvan,Volt, & Ammeters","Meas of Resis and Pot","AC Bridges","Meas of Energy and Power","CRO and Electr Meas","Instrument Transformers"],
      ["Diodes & Their Appl","BJT, FET, & Their Blast cir","Small Sig Analysis","Operational Amplifiers","Oscis & Feedback Amp","Miscellaneous"],
      ["Boolean Algebra & Min","Logic gates","Combinational Logic Circuits","Sequential Logic Circuits","Logic Families","A/D and D/A Converters","Microprocessors"],
      ["Pow semi Devices & CommutTech","Phase Controlled Rectifiers","Choppers","Inverters","Electrical Drives","Miscellaneous"],
      ["Coord Sys & Vector calculus","Electrostatic Field","Magnetostaic Field","Maxwell's Equations","EM Wave Propogation"]
      ],
      subjectTopicsWeightage:[ 
      [0.304093567251462,0.274853801169591,0.0701754385964912,0.105263157894737,0.134502923976608,0.0760233918128655,0.0350877192982456],
      [0.405660377358491,0.207547169811321,0.0235849056603774,0.113207547169811,0.108490566037736,0.108490566037736,0.0330188679245283],
      [0.157894736842105,0.308270676691729,0.150375939849624,0.0977443609022556,0.150375939849624,0.135338345864662],
      [0.183333333333333,0.276666666666667,0.233333333333333,0.22,0.0866666666666667],
      [0.156488549618321,0.0877862595419847,0.0610687022900763,0.0648854961832061,0.16793893129771,0.122137404580153,0.129770992366412,0.0229007633587786,0.118320610687023,0.0305343511450382,0.0190839694656489,0.0190839694656489],
      [0.155913978494624,0.032258064516129,0.139784946236559,0.155913978494624,0.0645161290322581,0.198924731182796,0.0752688172043011,0.17741935483871],
      [0.064,0.28,0.104,0.072,0.232,0.2,0.048],
      [0.209302325581395,0.24031007751938,0.0232558139534884,0.387596899224806,0.10077519379845,0.0387596899224806],
      [0.151785714285714,0.116071428571429,0.107142857142857,0.232142857142857,0.0803571428571429,0.0982142857142857,0.214285714285714],
      [0.204301075268817,0.295698924731183,0.172043010752688,0.193548387096774,0.0483870967741935,0.0860215053763441],
      [0.150684931506849,0.397260273972603,0.315068493150685,0.0547945205479452,0.0821917808219178]
      ]
    }
    ]
    },
    
    electronics: {
        preparationTypes: [
      {
        name: "Complete GATE Preparation",
        slug: "complete-gate",
        description: "Complete GATE electronics engineering preparation covering all subjects",
      subjectName:["Eng Maths","Net Theo","EM","Con Sys","Elec Dev & Circ","Ana Circ","Dig Circ","Micro Pro","Sig & Sys","Comm Sys"],
      subjectWeightage: [0.13109243697479,0.0915966386554622,0.109243697478992,0.0991596638655462,0.119327731092437,0.105882352941176,0.0899159663865546,0.0109243697478992,0.122689075630252,0.120168067226891],
      subjectTopicsName:[ 
      ["Linear Algebra","Calculus","Diffrential Equation","Complex Variables","Probablity and Statistics","Numerical Method","Transform Theory"],
      ["Basics of Network Analysis","Sinusoidal Steady state","Network Theorems","Transient Analysis","Two Port Networks","Graph Theory and State Equations","Network Functions"],
      ["Basics of Electromagnetics","Uniform Plane waves","Transmission Lines","Wave Guides","Antennas"],
      ["Basics of Control Systems","Block Diagram and Signal Flow Graph","Compensators and Controllers","Time Response Analysis","Stsbility Analysis","Root Locus","Frequency Response Analysis","State Space Analysis"],
      ["Basic Semiconsuctor Physics","PN-Junction Diodes and Special Diodes","BJT and FET Basics"],
      ["Operational Amplifiers","Diodes Applications","BJT Analysis","FET and MOSFET Analysis","Frequency Response of Amplifiers","Feedback Amplifiers","Oscillator Circuits","Power Amplifiers","Multivibrators and 555 Timer"],
      ["Number Systems","Boolean Algebra","Logic Gates","Combinational Circuits","Sequential Circuits","Logic Families","Memories","ADC and DAC"],
      ["Basics of 8085 Microprocessor","Instructions of 8085 Microprocessor","Memory Interfacing","Microprocessor 8085 Interfacing","Microprocessor 8085 Interrupts","Microprocessor 8085 Programming"],
      ["Basics of Signal and Systems","LTI Systems Continous and Discrete (Time Domain)","Fourier Series","Fourier Transform, Frquency Response and Correlation","Laplace Transform","Z-Transform","DTFT and DFT","Sampling"],
      ["Analog Communication Systems","Random Signals and Noise","Sigital Communication Systems","Information Theory"]
      ],
      subjectTopicsWeightage:[ 
      [0.205882352941176,0.308823529411765,0.117647058823529,0.112745098039216,0.102941176470588,0.0735294117647059,0.0784313725490196],
      [0.257510729613734,0.206008583690987,0.15450643776824,0.15450643776824,0.141630901287554,0.0300429184549356,0.055793991416309],
      [0.192,0.26,0.228,0.148,0.172],
      [0.0669456066945607,0.0836820083682008,0.0711297071129707,0.188284518828452,0.133891213389121,0.096234309623431,0.209205020920502,0.150627615062762],
      [0.333333333333333,0.28310502283105,0.383561643835616],
      [0.264808362369338,0.146341463414634,0.278745644599303,0.111498257839721,0.0522648083623693,0.0696864111498258,0.0313588850174216,0.0209059233449477,0.024390243902439],
      [0.0553191489361702,0.0936170212765957,0.157446808510638,0.161702127659574,0.251063829787234,0.136170212765957,0.0638297872340425,0.0808510638297872],
      [0.122448979591837,0.36734693877551,0.122448979591837,0.0816326530612245,0.0816326530612245,0.224489795918367],
      [0.11328125,0.1328125,0.07421875,0.18359375,0.1796875,0.15625,0.08984375,0.0703125],
      [0.274914089347079,0.278350515463918,0.371134020618557,0.0756013745704467]
      ]
    }
]
    },
    
    computerscience: {
        preparationTypes: [
      {
        name: "Complete GATE Preparation",
        slug: "complete-gate",
        description: "Complete GATE computer science engineering preparation covering all subjects",
      subjectName:["Dis & EM","TOC","Dig Log","COA","Prog & DS","Algo","Com Des","Op Sys","DBMS","Com Net"],
      subjectWeightage:[0.217647058823529,0.0852941176470588,0.0637254901960784,0.0813725490196078,0.130392156862745,0.0852941176470588,0.0519607843137255,0.092156862745098,0.0862745098039216,0.105882352941176],
      subjectTopicsName:[ 
      ["Mathematical Logic","Set Theory & Algebra","Combinatiorics","Graph Theory","Probability","Linear Algebra","Calculus"],
      ["Finite Automata : Regular Languages","Push Down Automata: CFL & DCFL","Turing Machine: RE, REC and Undicecidability"],
      ["Logic Functions & Minimization","Combinational Circuits","Sequential Circuits","Number Systems"],
      ["Cache & Main Memory","Instructions : Pipelining and Addressing Modes","CPU Control Design & Interfaces","Secondary Memory & DMA"],
      ["Programming","Arrays","Stacks & Queues","Linked List","Trees","Graphs","Hashing"],
      ["Algorithm Analysis & Asymptotic Notations","Divide & Conquer","Greedy Method","Dynamic Programming","P & NP Concepts","Misclleneous Topic"],
      ["Compiler Design","Lexical Analysis","Parsing Techniques","Syntax Directed Translation","Code Generation & Optimization"],
      ["PM 1- Intr, Process, Threads, & CPU Scheduling","PM 2- IPC, Syncronization and Concurrency","Deadlock","Memory Mangement & Virtual Memory","File System & Device Management"],
      ["ER-Model","Database Design: Functional Dependencies and Normalization","Structured Queue Language (SQL)","Relational Model : Relational Algebra and Tuple Calculus","Transactions and Concurrency Control","File Structures"],
      ["ISO/OSI Stack and SWP","LAN","TCP, UDP and IP","Routing, Application layer and Network Security"]
      ],
      subjectTopicsWeightage:[ 
      [0.150990099009901,0.23019801980198,0.099009900990099,0.148514851485149,0.141089108910891,0.148514851485149,0.0816831683168317],
      [0.493023255813954,0.311627906976744,0.195348837209302],
      [0.335227272727273,0.170454545454545,0.1875,0.306818181818182],
      [0.294416243654822,0.401015228426396,0.131979695431472,0.17258883248731],
      [0.456666666666667,0.0466666666666667,0.0966666666666667,0.03,0.263333333333333,0.0566666666666667,0.05],
      [0.274881516587678,0.18957345971564,0.222748815165877,0.0710900473933649,0.042654028436019,0.199052132701422],
      [0.168316831683168,0.425742574257426,0.198019801980198,0.207920792079208,0], // Need to add 5th weight
      [0.272357723577236,0.166666666666667,0.0894308943089431,0.32520325203252,0.146341463414634],
      [0.0555555555555556,0.272222222222222,0.211111111111111,0.172222222222222,0.161111111111111,0.127777777777778],
      [0.181347150259067,0.155440414507772,0.404145077720207,0.259067357512953]
      ]
    }
]
    },
    instrumentation: {
        preparationTypes: [
      {
        name: "Complete GATE Preparation",
        slug: "complete-gate",
        description: "Complete GATE Instrumentation engineering preparation covering all subjects",
      subjectName:["Eng Math","Elec Circ","Instr","Ana Elec","Sig & Sys & Comm Sys","Con Sys & Pro Con","Dig Elec","Meas","Optical Instr"],
      subjectWeightage:[0.133333333333333,0.119607843137255,0.111764705882353,0.127450980392157,0.145098039215686,0.119607843137255,0.096078431372549,0.0823529411764706,0.0647058823529412],
      subjectTopicsName:[ 
        ["Linear Algebra","Calculus","Differential Equation","Complex Variables","Probability and Statistics","Numerical Method","Vector Calculus"],
        ["Network Laws & Network Theorems","RL, RC, RLC Circuits & Transients","Two-Port Networks"],
        ["Basics of Transducers","Resistive & Inductive Transducers","Capacitive & Piezoelectric Transducers","Pressure, Flow & Temperature Measurement","Velocity, Acce, Force, Torque & Seismic Meas","Miscellaneous"],
        ["Diode Circuits, Zener Diodes as a Circuit Element","BJY, JFET, MOSFET, their Biasing & Frequency Res","OP-Amp and Instrumentation Amplifiers","Wave Shaping Circuits and Filters","Miscellaneous"],
        ["Continuous Time LTI Systems","Discrete Time LTI Systems","Fourier Series","Fourier Transform","Laplace Transform","Z-Transform","Discrete Time Fourier Transform (DTFT)","DFT & Frequency Response","Sampling","Digital Filters","Communication Systems"],
        ["Basics of Control System & Transfer Function","Block Diagram & Signal Flow Graph","Compensators & Controllers","Time Response Analysis","Stability Analysis","Root Locus Techniques","FRA, Bode Plot & Nyquist Plot","State Space Analysis","Process Dynamics & Controls"],
        ["Number Systems","Boolean Algebra ","Logic Gates","Combinational Logic Circuits","Sequential Logic Circuits","Logic Families","Memories & Interfacing","ADC & DAC","Basics of Microprocessors & Instruction Set"],
        ["Digital Voltmeter (DVM)","Galvanometers, Voltmeter and Ammeter","Meas of Resistance & Potentiometer, DC Bridge","Meas of Ind Cap, AC Bridge & Q-Meter","Measurement of Energy and Power","Measurement of Phase & Frequency","CRO & Electronics Measurements","Stat & Dyn Charac, Error Ana & Stat Ana of Data","Miscellaneous"],
        ["Basics of Fiber Optics (Optical)","Interferometer, App in Metrology (Optical)","LED, Lasers & Photodiode (Optical)","Miscellaneous (Optical)","Mass Spectrometry, X-ray & Nuclear Meas (Ana)","UV, Visible & IR Spectrometry Chromat (Ana)","Instru, ECG, EEG & EMG (Biomedical)","Clinical Measurement (Biomedical)","Ultrasonic Trans & Ultrasonography (Biomedical)"]
        ],
      subjectTopicsWeightage:[ 
      [0.23134328358209,0.208955223880597,0.0895522388059701,0.164179104477612,0.149253731343284,0.0746268656716418,0.082089552238806],
      [0.387096774193548,0.505376344086022,0.10752688172043],
      [0.0267379679144385,0.197860962566845,0.155080213903743,0.385026737967914,0.133689839572193,0.101604278074866],
      [0.122093023255814,0.191860465116279,0.406976744186047,0.174418604651163,0.104651162790698],
      [0.151898734177215,0.10126582278481,0.0632911392405063,0.0569620253164557,0.0506329113924051,0.0886075949367089,0.0126582278481013,0.0316455696202532,0.0506329113924051,0.145569620253165,0.246835443037975],
      [0.112903225806452,0.0483870967741935,0.112903225806452,0.182795698924731,0.0806451612903226,0.0860215053763441,0.209677419354839,0.0806451612903226,0.0860215053763441],
      [0.0549450549450549,0.0989010989010989,0.0934065934065934,0.0714285714285714,0.192307692307692,0.0604395604395604,0.0769230769230769,0.186813186813187,0.164835164835165],
      [0.062111801242236,0.173913043478261,0.130434782608696,0.161490683229814,0.093167701863354,0.0124223602484472,0.111801242236025,0.236024844720497,0.0186335403726708],
      [0.136054421768707,0.0884353741496599,0.156462585034014,0.156462585034014,0.142857142857143,0.136054421768707,0.0816326530612245,0.0612244897959184,0.0408163265306122]
      ]
    }
]
    },
    chemical: {
        preparationTypes: [
      {
        name: "Complete GATE Preparation",
        slug: "complete-gate",
        description: "Complete GATE chemical engineering preparation covering all subjects",
      subjectName:["Eng Math","Pro Cal","Thermo","FM & MO","HT","MT","CRE","Inst & PC","PD & Eco","Che Tech"],
      subjectWeightage:[0.144117647058824,0.0514705882352941,0.111764705882353,0.127941176470588,0.0985294117647059,0.119117647058824,0.125,0.0794117647058823,0.0705882352941176,0.0720588235294118],
      subjectTopicsName:[ 
      ["Linear Algebra","Calculus","Diffrential Equation","Complex Variables","Probablity and Statistics","Numerical Method"],
      ["Thermodynamics 2","Laws of Conservation of Mass & Energy","Use of Tie Components","Recycle","Bypass & Purge","Degree of Freedom Analysis","Reactions","Basics"],
      ["1st & 2nd law of Thermo & Appl","Equation of State","Phase Equilibria","Fugacity","Excess Properties and Activity Corelations","Chemaical Reaction Equlibria","Mixture"],
      ["Fluid Static","Newtonian and Non-Newtonian Fluids","Navier Stokes and Bernoullis Equation","Friction","Dimensional Analysis","Pipeline","Flow Meters","Pumps & Compressors","Packed and Fluidized Bed","Boundary layer Theory","Size Reduction & Size Separation","Free & Hindered Settling","Centrifuge & Cyclone","Thickneing and Classification","Filtration","Mixing & Agitation","Conveying of Solids"],
      ["Conduction","Convection","Radiation","Heat Transfer Cofficient","Steady and Unsteady Heat Conduction","Condensation and Evaporation","Types of Heat Exchanger Evap and Their Designs"],
      ["Fick's law","Molecular Diffusion in Fluids","Mass Transfer Cofficients","Film Penetration and Surface Renewal Theories","Momentum and Heat and mass Tranfer Analogies","Design and Operation of Equipment for Distilation","Absorption","Liquid-Liquid Extraction","Crytallisation","Drying","Humidification","Equipment"],
      ["Reaction Rates","Kinetic Data Interpretation","Single Reactions in Reactors","Multiple Reactions in Reactors","Non Ideal Reactors","Residence Time","Non-Isothermal Reactors","Catalytic Reactions"],
      ["Instrumentation","Frquency Response, Tuning, Body Dynamics","Transfer Functions","Stability","Controller Modes","Control valves","Closed Loop systems","Cascade","Feed Foeward Control"],
      ["Design","Economics"],
      ["Inorganic Chemical Industries","Natural Product Industries","Petroleum & Petrochemicals","Polymerization"]
      ],
      subjectTopicsWeightage:[ 
      [0.34,0.32,0.0933333333333333,0.113333333333333,0.0866666666666667,0.0466666666666667],
      [0.150943396226415,0.30188679245283,0.0188679245283019,0.0566037735849057,0.0377358490566038,0.132075471698113,0.245283018867925,0.0566037735849057],
      [0.459770114942529,0.172413793103448,0.0344827586206897,0.0344827586206897,0.0919540229885057,0.103448275862069,0.103448275862069],
      [0.12,0.016,0.184,0.016,0.016,0.048,0.032,0.056,0.12,0.024,0.136,0.056,0.048,0.008,0.064,0.048,0.008],
      [0.0963855421686747,0.036144578313253,0.120481927710843,0.204819277108434,0.265060240963855,0.036144578313253,0.240963855421687],
      [0.0597014925373134,0.0671641791044776,0.0746268656716418,0.0298507462686567,0.104477611940299,0.283582089552239,0.141791044776119,0.0746268656716418,0.00746268656716418,0.0895522388059701,0.0522388059701493,0.0149253731343284],
      [0.0862068965517241,0.189655172413793,0.25,0.0603448275862069,0.0517241379310345,0.0948275862068965,0.112068965517241,0.155172413793103],
      [0.113636363636364,0.295454545454545,0.215909090909091,0.102272727272727,0.113636363636364,0.0113636363636364,0.0909090909090909,0.0340909090909091,0.0227272727272727],
      [0.272727272727273,0.727272727272727],
      [0.392405063291139,0.126582278481013,0.316455696202532,0.164556962025316]
      ]
    }
]
    }
    };

    // ESE Exam Data (similar structure to GATE)
    const eseExamData = {
      mechanical: {
        preparationTypes: [
      {
        name: "Complete ESE Preparation",
        slug: "complete-ese",
        description: "Complete ESE mechanical engineering preparation covering all subjects",
      subjectName:["GS & EA","FM","Thermo","HMT","ICE","RAC","Turbo","Pow Plant","SOM & EM","Materials","TOM","MD","Manf","IE","Mechatronics","Renew Ene"],
      subjectWeightage:[0.125,0.0771506617434814,0.061197882506965,0.0470626231206206,0.04026556065416,0.0659663974969139,0.0735930511487152,0.0477619699011737,0.079478249840681,0.050050658518799,0.0956200739639114,0.0461863047097261,0.0577678908537553,0.0448695249386017,0.0649396402576436,0.0230895103448521],
      subjectTopicsName:
        [ 
		["CI","EA","EM","D&D","QP","EE","PM","MS","ICT","EV"],
		["Fluid properties","Fluid Pressure & Measurement","Hydrostatic Forces on Surface","Buoyancy, Floatation & Liquids in Relative Equilibrium","Fluid Kinematics","Fluid Dynamics and Flow Measurements","Flow Through Pipes","Vortex Flow","Laminar Flow","Turbulent Flow","Boundary layer Theory","Open Channel Flow","Drag & Lift","Dimensional Analysis","Flow over Notches & Weirs"],
		["Thermodynamic System, Processes & Zeroth law","First law, Heat & Work, Energy","Second Law, Carnot Cycle and Entropy","Irreversibility and Availability","Thermodynamic Relations","Pure Substances"],
		["Conduction","Unsteady State Conduction Heat Transfer","Heat Dissipation from Extended Surfaces (Fins)","Free & Forced Convection","Radiation","Heat Exchangers","Boiling & Condensation"],
		["Air Standard Cycles","Fuel Characteristics","Combustion and Knocking in SI and CI Engines","Fuels & Emissions, Fuel Gas Analysis","Testing & Performance of IC Engine"],
		["Heat Pump & Refrigeration Systems","Ideal, Vapor, Air Refrigeration Cycle and Refrigerants","Refrigeration Equipment's","Psychometry & Psychometric Processes","Cooling Load Calculations & Duct Design"],
		["Impact of jet & Hydraulic Turbines","Hydraulic Pumps","Hydraulic machines","Air Compressors (Reciprocating & Rotary)","Steam Turbines","Gas Turbines","Jet Propulsion and Compressible Flow"],
		["Thermal Power Plants Components","Nozzles","Nuclear Power Plant","Miscellaneous"],
		["Stress & Strain","Stress Strain Relationship & Elastic Constants","Principal Stresses & Strains and Mohr's Circle","Thin Cylinder & Thick Cylinder","SFC/BMD","Bending of Beams, Shear Stress Distribution","Torsion of Shafts","Euler's Theory Of Column","Strain Energy and Thermal Stresses","Deflection of Beams","Combined Stresses","Engineering Mechanics"],
		["Crystal Systems","Alloy and Binary Phase Diagrams","Heat treatment of Steels","Mechanicals Testing and Mechanical Properties of Materials","Plastic, Ceramic and Composite materials","Properties & Application of Various Ferrous & Non-Ferrous Metals and Their Alloys"],
		["Displacement, Velocity & Acceleration","Planer Mechanism","Cams","Dynamic Analysis of Slider-Crank","Gear & Gear Trains","Flywheel","Vibration","Governors","Balancing & Gyroscope"],
		["Theories of Failure (Static & Dynamic)","Bolted, Riveted & Welded Joint","Bearings, Shafts Axels & Keys","Gears","Brakes, Clutches and Ropes","Couplings, Cotters, Belt and Chain Drives","Power Screws","Helical Springs"],
		["Metal casting","Metal Forming & sheet Metal Operations","Joining/Welding","machining & machine Tool Operation","Metrology & Inspection","CIMS","Non-Conventional machining Process","Powder Metallurgy"],
		["Forecasting","Inventory Control & Break Even Analysis","Linear Programming","PERT & CPM","Queuing Theory","Scheduling, Line balancing, Product Development, MRP, Processing Planning and Control Plant layout ","Transportation & Assignment","Work Study & Work Measurement","Value Engineering","Element of computation & maintenance"],
		["Mechatronics & Robotics"],
		["Renewable Energy"]
		],
      subjectTopicsWeightage:
        [ 
		[0.0833333333333333,0.09,0.0766666666666667,0.0966666666666667,0.106666666666667,0.13,0.09,0.16,0.0766666666666667,0.09],
		[0.114386946386946,0.0853286713286713,0.0839440559440559,0.0936363636363636,0.0775011655011655,0.154041958041958,0.112540792540793,0.0281351981351981,0.143426573426573,0.00692307692307692,0.0249230769230769,0.0207692307692308,0.0124615384615385,0.0396736596736597,0.00230769230769231],
		[0.11494412077809,0.352576483112358,0.315413735926965,0.108725494370786,0.0312,0.0771627471853931],
		[0.310208204295665,0.0187134502923977,0.0826158779190623,0.189793159346897,0.157841945533564,0.165231755838125,0.0755983340594132],
		[0.175091404960932,0.159091404960932,0.145818553720699,0.172545702480466,0.347455661162096],
		[0.181843431755558,0.386382430153231,0.119238737025994,0.220181456498232,0.0923882322405654],
		[0.139249032809549,0.129154395585574,0.115701669560832,0.147023525395805,0.233072198111211,0.133367284702787,0.102432087382692],
		[0.542566942822637,0.17282086785283,0.10782086785283,0.176795936891822],
		[0.103102763021217,0.100986360904815,0.0812411052084869,0.0958155437503071,0.0969939329450054,0.0811209170719896,0.0926409405757039,0.0600770840444657,0.042207854191545,0.0442040681714498,0.024218436202127,0.177393721198011],
		[0.122447968726822,0.223495325738824,0.202044221637878,0.195735073372894,0.145186148673829,0.11109150184985],
		[0.0595914902772834,0.109144700796943,0.080099057643416,0.0512129615570039,0.197622287160638,0.0578519657063815,0.246186075094511,0.0801788311769735,0.118113784435222],
		[0.150367692158597,0.210734484308194,0.236231566504147,0.0198952879581152,0.155603294252838,0.0917804047150419,0.0624610329872932,0.0729322371757749], 
		[0.168077043077043,0.125384675384675,0.112564162564163,0.319230919230919,0.136025761025761,0.115641115641116,0.0153846153846154,0.00769230769230769],
		[0.0660637636460881,0.278735523052999,0.0651587862705225,0.145702603155459,0.0624438541438257,0.148417120052357,0.0235294117647059,0.0651587862705225,0.0760185147773099,0.068778695772785],
		[1],
		[1]
		]
    },
    {
         name: "Technical ESE Preparation",
        slug: "technical-ese",
        description: "Technical ESE mechanical engineering preparation covering all subjects",
        subjectName:["FM","Thermo","HMT","ICE","RAC","Turbo","Pow Plant","SOM & EM","Materials","TOM","MD","Manf","IE","Mechatronics","Renew Ene"],
      subjectWeightage:[0.088172184849693,0.0699404371508171,0.053785854994995,0.0460177836047543,0.0753901685679016,0.0841063441699602,0.0545851084584842,0.0908322855322069,0.0572007525929132,0.109280084530184,0.052784348239687,0.066020446690006,0.0512794570726876,0.0742167317230213,0.0263880118226881],
      subjectTopicsName:
        [ 
		["Fluid properties","Fluid Pressure & Measurement","Hydrostatic Forces on Surface","Buoyancy, Floatation & Liquids in Relative Equilibrium","Fluid Kinematics","Fluid Dynamics and Flow Measurements","Flow Through Pipes","Vortex Flow","Laminar Flow","Turbulent Flow","Boundary layer Theory","Open Channel Flow","Drag & Lift","Dimensional Analysis","Flow over Notches & Weirs"],
      ["Thermodynamic System, Processes & Zeroth law","First law, Heat & Work, Energy","Second Law, Carnot Cycle and Entropy","Irreversibility and Availability","Thermodynamic Relations","Pure Substances"],
      ["Conduction","Unsteady State Conduction Heat Transfer","Heat Dissipation from Extended Surfaces (Fins)","Free & Forced Convection","Radiation","Heat Exchangers","Boiling & Condensation"],
      ["Air Standard Cycles","Fuel Characteristics","Combustion and Knocking in SI and CI Engines","Fuels & Emissions, Fuel Gas Analysis","Testing & Performance of IC Engine"],
      ["Heat Pump & Refrigeration Systems","Ideal, Vapor, Air Refrigeration Cycle and Refrigerants","Refrigeration Equipment's","Psychometry & Psychometric Processes","Cooling Load Calculations & Duct Design"],
      ["Impact of jet & Hydraulic Turbines","Hydraulic Pumps","Hydraulic machines","Air Compressors (Reciprocating & Rotary)","Steam Turbines","Gas Turbines","Jet Propulsion and Compressible Flow"],
      ["Thermal Power Plants Components","Nozzles","Nuclear Power Plant","Miscellaneous"],
      ["Stress & Strain","Stress Strain Relationship & Elastic Constants","Principal Stresses & Strains and Mohr's Circle","Thin Cylinder & Thick Cylinder","SFC/BMD","Bending of Beams, Shear Stress Distribution","Torsion of Shafts","Euler's Theory Of Column","Strain Energy and Thermal Stresses","Deflection of Beams","Combined Stresses","Engineering Mechanics"],
      ["Crystal Systems","Alloy and Binary Phase Diagrams","Heat treatment of Steels","Mechanicals Testing and Mechanical Properties of Materials","Plastic, Ceramic and Composite materials","Properties & Application of Various Ferrous & Non-Ferrous Metals and Their Alloys"],
      ["Displacement, Velocity & Acceleration","Planer Mechanism","Cams","Dynamic Analysis of Slider-Crank","Gear & Gear Trains","Flywheel","Vibration","Governors","Balancing & Gyroscope"],
      ["Theories of Failure (Static & Dynamic)","Bolted, Riveted & Welded Joint","Bearings, Shafts Axels & Keys","Gears","Brakes, Clutches and Ropes","Couplings, Cotters, Belt and Chain Drives","Power Screws","Helical Springs"],
      ["Metal casting","Metal Forming & sheet Metal Operations","Joining/Welding","machining & machine Tool Operation","Metrology & Inspection","CIMS","Non-Conventional machining Process","Powder Metallurgy"],
      ["Forecasting","Inventory Control & Break Even Analysis","Linear Programming","PERT & CPM","Queuing Theory","Scheduling, Line balancing, Product Development, MRP, Processing Planning and Control Plant layout ","Transportation & Assignment","Work Study & Work Measurement","Value Engineering","Element of computation & maintenance"],
      ["Mechatronics & Robotics"],
      ["Renewable Energy"]
		],
      subjectTopicsWeightage:
        [ 
		[0.114386946386946,0.0853286713286713,0.0839440559440559,0.0936363636363636,0.0775011655011655,0.154041958041958,0.112540792540793,0.0281351981351981,0.143426573426573,0.00692307692307692,0.0249230769230769,0.0207692307692308,0.0124615384615385,0.0396736596736597,0.00230769230769231],
      [0.11494412077809,0.352576483112358,0.315413735926965,0.108725494370786,0.0312,0.0771627471853931],
      [0.310208204295665,0.0187134502923977,0.0826158779190623,0.189793159346897,0.157841945533564,0.165231755838125,0.0755983340594132],
      [0.175091404960932,0.159091404960932,0.145818553720699,0.172545702480466,0.347455661162096],
      [0.181843431755558,0.386382430153231,0.119238737025994,0.220181456498232,0.0923882322405654],
      [0.139249032809549,0.129154395585574,0.115701669560832,0.147023525395805,0.233072198111211,0.133367284702787,0.102432087382692],
      [0.542566942822637,0.17282086785283,0.10782086785283,0.176795936891822],
      [0.103102763021217,0.100986360904815,0.0812411052084869,0.0958155437503071,0.0969939329450054,0.0811209170719896,0.0926409405757039,0.0600770840444657,0.042207854191545,0.0442040681714498,0.024218436202127,0.177393721198011],
      [0.122447968726822,0.223495325738824,0.202044221637878,0.195735073372894,0.145186148673829,0.11109150184985],
      [0.0595914902772834,0.109144700796943,0.080099057643416,0.0512129615570039,0.197622287160638,0.0578519657063815,0.246186075094511,0.0801788311769735,0.118113784435222],
      [0.150367692158597,0.210734484308194,0.236231566504147,0.0198952879581152,0.155603294252838,0.0917804047150419,0.0624610329872932,0.0729322371757749], 
      [0.168077043077043,0.125384675384675,0.112564162564163,0.319230919230919,0.136025761025761,0.115641115641116,0.0153846153846154,0.00769230769230769],
      [0.0660637636460881,0.278735523052999,0.0651587862705225,0.145702603155459,0.0624438541438257,0.148417120052357,0.0235294117647059,0.0651587862705225,0.0760185147773099,0.068778695772785],
      [1],
      [1]
		]
    },
    {
            name: "General ESE Preparation",
        slug: "general-ese",
        description: "General ESE mechanical engineering preparation covering all subjects",
        subjectName:["GS & EA"],
      subjectWeightage:[1],
      subjectTopicsName:
        [ 
		 ["CI","EA","EM","D&D","QP","EE","PM","MS","ICT","EV"]
		],
      subjectTopicsWeightage:
        [ 
		 [0.0833333333333333,0.09,0.0766666666666667,0.0966666666666667,0.106666666666667,0.13,0.09,0.16,0.0766666666666667,0.09]
		]
    }
    
]
    },
    
civil: {
    preparationTypes: [
      {
        name: "Complete ESE Preparation",
        slug: "complete-ese",
        description: "Complete ESE civil engineering preparation covering all subjects",
        subjectName: ["GS & EA","Build Mat","SM","Struct Ana","Steel Struct","RCC & Mason","Project M","FM & Mach","Eng Hydro","Water Res Mgmt","Env Eng","Geo & Found","Surveying","Highway Eng","Rail Eng","Airport"],
        subjectWeightage: [0.125,0.0783290066521461,0.111741958695785,0.047980852877881,0.0566438740846745,0.0633678305037079,0.0412667460308794,0.112324767605698,0.0336423699775667,0.0354258527908182,0.0897326413965278,0.099524373532032,0.0471047890559131,0.0329172092846694,0.0102093854392022,0.0147883420724985],
        subjectTopicsName: [
          ["CI","EA","EM","D&D","QP","EE","PM","MS","ICT","EV"],
		["Cement","Mortar","Lime","Concrete","Stones, Bricks and Bricks Masonry","Timber","Oil, Varnsihes Paint, Distempers & Miscellenous"],
		["Properties of Materials","Simple Stress-Strain & Elastic Constants","Shear Force and Bending Moments","Principal Stress-Strain and Theories of Failure","Deflection of Beams","Bending & Shear stresses in Beams","Thick & Thin cylinders and Spheres","Torsion in shafts & Springs","Theory of Columns & Retaining walls","Shear Centre, Moment of Inertia & Principal Axes"],
		["Determinacy & Indeterminacy","Influence Line Diagram and Rolling Loads","Arches and Suspension Bridges","Methods of Structural Analysis","Trusses","Matrix Method of Structural Analysis","Structure Dynamics and Suspended Cables"],
		["Structural Fasteners","Tension Members","Compression Member","Beams","Plate Girders and Industrial Roofs","Plastic Analysis"],
		["Fundamentals of RCC","Beams and Slabs","Shear, Bond, Torsion and Development Length","Walls, Columns and Footings","Prestress Concrete","Masonry Structures and Earthquake Engineering","Miscellenous"],
		["Project Mangement & Network Technique","PERT & CPM","Crashing, Resource Allocation, Updating and Engineering Economy","Concreting Equipments"],
		["Fluid Properties","Manometry","Hydrostatic Forces","Bouancy & Floatation","Fluid Kinematics","Fluid Dynamics, Flow Measurements","Viscous Flow of Incompressible Fluid","Flow Through Pipes","Drag & Lift Force","Boundary layer Theory","Turbulent Flow","Dimensional Analysis & Modal Analysis","Notches & Weirs","Impact of Jets & Turbines","Pumps","Open Channel Flow"],
		["Percipitation and General Aspects of Hydrology","Evaporation, Transpiration, Evapotranspiration and Stream Flow Measurement","Infiltration, Runoff and Hydrograph","Floods, Flood Routing & Flood Control"],
		["Methods of Irrigation, Quality of Irrigation Water & Water Logging","Water Requirement of Crops","Design of Unlined & Lined Canals","Design & Construction of Gravity Dams","Conveyance Structures for Canals & Outlets\Modules","Theories of Seepage","River Training Works & Diversion Headworks","Dams(general), Spillways & Energy Dissipiators"],
		["Water Demand","Conduits For Transporting Water","Development of Ground Water and Well Hydraulics","Quality Control of Water Supplies","Water Treatment & Distribution System","Design of Sewer","Quality and Characterstics of Sewage","Disposing of the Sewage Efluents","Treatment of Sewage","Air and Sound Pollution"],
		["Properties of Soils","Classification of Soils","Effective Stresses & Permeability","Seepage Analysis","Compaction of Soil","Compressibility & Consolidation","Stress Distribution in the Soil","Shear Strength of Soil","Retaining Wall/ Earth Pressure Theories","Stability Analysis of Slopes","Shallow Foundation and Bearing Capacity","Deep Foundation, Sheet Pile Walls and Machine Foundation","Soil Stabilization and Soil Exploration"],
		["Fundamental Concepts of Surveying and Linear Measurements","Compass Surveying, Theodilites and Traverse Surveying","Levelling, Contouring and Plane Table Surveying","Calculation of Area and Volume","Engineering Instruments","Tacheometric, Curve, Hydrographic Survey, Tides and Tringulation","Field Astronomy, Photogrammetic Survey, Remote sensing & Geology"],
		["Highway Development & Planning","Highway Geometric Design","Traffic Engineering","Pavement Design","Highway Materials, Maintenance & Properties"],
		["Rail Joints, Welding of Rails and Signals","Ballast, Formation and Sleepers","Geometric Design of the Track","Points and Crossing","Track Stresses, Traction and Tractive Resistance"],
		["Airport, Dock, Harbour & Tunnelling Engineering"],
        ],
        subjectTopicsWeightage: [
          [0.0833333333333333,0.09,0.0766666666666667,0.0966666666666667,0.106666666666667,0.13,0.09,0.16,0.0766666666666667,0.09],
		[0.119603636735111,0.0376698334865666,0.0424711410767188,0.40612422106446,0.16207477781183,0.109423843089182,0.122632546736132],
		[0.0506403248477276,0.189390389921391,0.135189234213129,0.169725128845854,0.100390441980322,0.125579155604144,0.0334634806601072,0.138750065073663,0.039694934666042,0.0171768441876204],
		[0.160247651731689,0.165620786060047,0.183518519888492,0.273966281082522,0.0438805970149254,0.0787805422837551,0.0939917089480207],
		[0.162649798651143,0.0813248993255713,0.137896439897448,0.0494286834290194,0.374884348888045,0.193818629819974],
		[0.0897224906374631,0.155923942141762,0.127486218388328,0.211039026509471,0.134274457605679,0.238287290342811,0.0433148535661542],
		[0.295108999868047,0.336590481349529,0.160098061684411,0.208246209832559],
		[0.0476262626262626,0.0182323232323232,0.00353535353535354,0.0182323232323232,0.0765151515151515,0.0653535353535353,0.0146464646464646,0.0673232323232323,0.0496464646464646,0.0344444444444444,0.00656565656565657,0.0613131313131313,0.0187373737373737,0.190050505050505,0.128686868686869,0.199090909090909],
		[0.187853107344633,0.0677024482109228,0.477118644067797,0.267325800376648],
		[0.0931475483062408,0.127201602360295,0.143417818576511,0.0947691699278625,0.117471872630565,0.0947691699278625,0.142964565702605,0.186295096612482],
		[0.00654362416107382,0.026982554850416,0.117096671384375,0.0764174632089661,0.277283280169502,0.0350362461255838,0.0832657898714627,0.100684586332617,0.136926197070872,0.139747678095785],
		[0.198708458523137,0.0250574123132922,0.0873062923356917,0.0892293692587687,0.0129807692307692,0.116690627725907,0.0680181107916303,0.105094753874153,0.0641145446321843,0.0463260830937227,0.111825523104922,0.0466920276979076,0.0279420276979076],
		[0.0909649122807017,0.17140350877193,0.282061403508772,0.00842105263157895,0.0804385964912281,0.0326315789473684,0.334078947368421],
		[0.00672645739910314,0.302159438944924,0.199860685788479,0.288706524146718,0.20255126874812],
		[0.206173670644234,0.192938376526587,0.525873953109173,0.0441176470588235,0.0308823529411765],
		[1]
        ]
      },
      {
        name: "Technical ESE Preparation",
        slug: "technical-ese",
        description: "Technical ESE civil engineering preparation covering technical subjects",
        subjectName: ["Build Mat","SM","Struct Ana","Steel Struct","RCC & Mason","Project M","FM & Mach","Eng Hydro","Water Res Mgmt","Env Eng","Geo & Found","Surveying","Highway Eng","Rail Eng","Airport"],
        subjectWeightage: [0.0895188647453099,0.127705095652326,0.054835260431864,0.0647358560967709,0.0724203777185233,0.0471619954638622,0.12837116297794,0.0384484228315048,0.0404866889037923,0.10255159016746,0.113742141179465,0.0538340446353292,0.0376196677539078,0.0116678690733739,0.0169009623685697],
        subjectTopicsName: [
          ["Cement","Mortar","Lime","Concrete","Stones, Bricks and Bricks Masonry","Timber","Oil, Varnsihes Paint, Distempers & Miscellenous"],
        ["Properties of Materials","Simple Stress-Strain & Elastic Constants","Shear Force and Bending Moments","Principal Stress-Strain and Theories of Failure","Deflection of Beams","Bending & Shear stresses in Beams","Thick & Thin cylinders and Spheres","Torsion in shafts & Springs","Theory of Columns & Retaining walls","Shear Centre, Moment of Inertia & Principal Axes"],
        ["Determinacy & Indeterminacy","Influence Line Diagram and Rolling Loads","Arches and Suspension Bridges","Methods of Structural Analysis","Trusses","Matrix Method of Structural Analysis","Structure Dynamics and Suspended Cables"],
        ["Structural Fasteners","Tension Members","Compression Member","Beams","Plate Girders and Industrial Roofs","Plastic Analysis"],
        ["Fundamentals of RCC","Beams and Slabs","Shear, Bond, Torsion and Development Length","Walls, Columns and Footings","Prestress Concrete","Masonry Structures and Earthquake Engineering","Miscellenous"],
        ["Project Mangement & Network Technique","PERT & CPM","Crashing, Resource Allocation, Updating and Engineering Economy","Concreting Equipments"],
        ["Fluid Properties","Manometry","Hydrostatic Forces","Bouancy & Floatation","Fluid Kinematics","Fluid Dynamics, Flow Measurements","Viscous Flow of Incompressible Fluid","Flow Through Pipes","Drag & Lift Force","Boundary layer Theory","Turbulent Flow","Dimensional Analysis & Modal Analysis","Notches & Weirs","Impact of Jets & Turbines","Pumps","Open Channel Flow"],
        ["Percipitation and General Aspects of Hydrology","Evaporation, Transpiration, Evapotranspiration and Stream Flow Measurement","Infiltration, Runoff and Hydrograph","Floods, Flood Routing & Flood Control"],
        ["Methods of Irrigation, Quality of Irrigation Water & Water Logging","Water Requirement of Crops","Design of Unlined & Lined Canals","Design & Construction of Gravity Dams","Conveyance Structures for Canals & Outlets\Modules","Theories of Seepage","River Training Works & Diversion Headworks","Dams(general), Spillways & Energy Dissipiators"],
        ["Water Demand","Conduits For Transporting Water","Development of Ground Water and Well Hydraulics","Quality Control of Water Supplies","Water Treatment & Distribution System","Design of Sewer","Quality and Characterstics of Sewage","Disposing of the Sewage Efluents","Treatment of Sewage","Air and Sound Pollution"],
        ["Properties of Soils","Classification of Soils","Effective Stresses & Permeability","Seepage Analysis","Compaction of Soil","Compressibility & Consolidation","Stress Distribution in the Soil","Shear Strength of Soil","Retaining Wall/ Earth Pressure Theories","Stability Analysis of Slopes","Shallow Foundation and Bearing Capacity","Deep Foundation, Sheet Pile Walls and Machine Foundation","Soil Stabilization and Soil Exploration"],
        ["Fundamental Concepts of Surveying and Linear Measurements","Compass Surveying, Theodilites and Traverse Surveying","Levelling, Contouring and Plane Table Surveying","Calculation of Area and Volume","Engineering Instruments","Tacheometric, Curve, Hydrographic Survey, Tides and Tringulation","Field Astronomy, Photogrammetic Survey, Remote sensing & Geology"],
        ["Highway Development & Planning","Highway Geometric Design","Traffic Engineering","Pavement Design","Highway Materials, Maintenance & Properties"],
        ["Rail Joints, Welding of Rails and Signals","Ballast, Formation and Sleepers","Geometric Design of the Track","Points and Crossing","Track Stresses, Traction and Tractive Resistance"],
        ["Airport, Dock, Harbour & Tunnelling Engineering"]
        ],
        subjectTopicsWeightage: [
          [0.119603636735111,0.0376698334865666,0.0424711410767188,0.40612422106446,0.16207477781183,0.109423843089182,0.122632546736132],
      [0.0506403248477276,0.189390389921391,0.135189234213129,0.169725128845854,0.100390441980322,0.125579155604144,0.0334634806601072,0.138750065073663,0.039694934666042,0.0171768441876204],
      [0.160247651731689,0.165620786060047,0.183518519888492,0.273966281082522,0.0438805970149254,0.0787805422837551,0.0939917089480207],
      [0.162649798651143,0.0813248993255713,0.137896439897448,0.0494286834290194,0.374884348888045,0.193818629819974],
      [0.0897224906374631,0.155923942141762,0.127486218388328,0.211039026509471,0.134274457605679,0.238287290342811,0.0433148535661542],
      [0.295108999868047,0.336590481349529,0.160098061684411,0.208246209832559],
      [0.0476262626262626,0.0182323232323232,0.00353535353535354,0.0182323232323232,0.0765151515151515,0.0653535353535353,0.0146464646464646,0.0673232323232323,0.0496464646464646,0.0344444444444444,0.00656565656565657,0.0613131313131313,0.0187373737373737,0.190050505050505,0.128686868686869,0.199090909090909],
      [0.187853107344633,0.0677024482109228,0.477118644067797,0.267325800376648],
      [0.0931475483062408,0.127201602360295,0.143417818576511,0.0947691699278625,0.117471872630565,0.0947691699278625,0.142964565702605,0.186295096612482],
      [0.00654362416107382,0.026982554850416,0.117096671384375,0.0764174632089661,0.277283280169502,0.0350362461255838,0.0832657898714627,0.100684586332617,0.136926197070872,0.139747678095785],
      [0.198708458523137,0.0250574123132922,0.0873062923356917,0.0892293692587687,0.0129807692307692,0.116690627725907,0.0680181107916303,0.105094753874153,0.0641145446321843,0.0463260830937227,0.111825523104922,0.0466920276979076,0.0279420276979076],
      [0.0909649122807017,0.17140350877193,0.282061403508772,0.00842105263157895,0.0804385964912281,0.0326315789473684,0.334078947368421],
      [0.00672645739910314,0.302159438944924,0.199860685788479,0.288706524146718,0.20255126874812],
      [0.206173670644234,0.192938376526587,0.525873953109173,0.0441176470588235,0.0308823529411765],
      [1]
        ]
      },
      {
        name: "General ESE Preparation",
        slug: "general-ese",
        description: "General ESE civil engineering preparation covering GS & EA",
        subjectName: ["GS & EA"],
        subjectWeightage: [1],
        subjectTopicsName: [
          ["CI","EA","EM","D&D","QP","EE","PM","MS","ICT","EV"]
        ],
        subjectTopicsWeightage: [
           [0.0833333333333333,0.09,0.0766666666666667,0.0966666666666667,0.106666666666667,0.13,0.09,0.16,0.0766666666666667,0.09]
        ]
      }
    ]
  },
    
    electrical: {
    preparationTypes: [
      {
        name: "Complete ESE Preparation",
        slug: "complete-ese",
        description: "Complete ESE electrical engineering preparation covering all subjects",
        subjectName: ["GS & EA","Materials","Elec Cir","Elec Field","Measure","Electronics","Comp Funda","Ana Elec","Digi Elec","Micro","Comm Sys","Con Sys","Elec Mac","Pow Sys","Pow Elec","Sys & Sig","Eng Math"],
        subjectWeightage: [0.125,0.0859108666783607,0.105464193964525,0.0347486829761132,0.0712080418392454,0.0239930647189304,0.0445173037000983,0.0185235110031611,0.0331426341741953,0.0158229338356487,0.0247347647424765,0.0956147753197546,0.102713239085993,0.0876519627751449,0.0486470315406216,0.0321850889349977,0.0501219047107341],
        subjectTopicsName: [
          ["CI","EA","EM","D&D","QP","EE","PM","MS","ICT","EV"],
		["Introduction to Engineering materials","Dielectric Propeties of Materials","Magnetic Properties of materials","Conductive Materials","SemiConductor Materials","Superconductors","Miscelleneous"],
		["Circuit Elements, Nodal and Mesh Analysis","Network Theorems","Transient response of DC and AC Networks, Sinusoidal Steady State Analysis","Second Order RLC Circuit, Resonance","Two Port Networks","Magnetically Coupled Circuits","Network Graph, Functions and Synthesis","Three Phase Circuit + Filters"],
		["Coordinate Sysytems & Vector Calculus","Electrostatic Fields","Magnetostatic Fields","Time Varying Electromagnetic Fields","Miscelleneous"],
		["Characterstics of Instruments and Measurements Systems","Measurements of Resistance and Potentiometers","AC Bridges","Galvanometers, Voltmeters & Ammeters","Measurement of Energy and Power","CRO & Frequency Measurement","Transducers & Sensors","Instrument Transformers","Digital Meter, Electrnic Instruments","Data Acquisition System, Recorders","Miscelleneous"],
		["Semiconducters Physics","Smiconductor Diode, Characterstics Diode","BJT-Characterstics, Biasing and Thermal Stabilization","Field Effect Transistors","BJT & FET Amplifiers","Frequency Response","Feedback amplifiers","Oscillators"],
		["Number System","Boolean Algebra","Memory Organization","Networking Fundamentals","Programming Languagee Methedology"],
		["Operational Amplifiers Characterstics And Application","Basic of Filter Circuits, output Stage and Application"],
		["Logic Gates and Switching Circuits","Conmbinational Logic Circuits","Sequentional Logic Circuits","Registers and Counters","Logic Families","A/D and D/A Converters"],
		["Introduction to 8085 and its Functional Organization","Microprocessor Interfacing","Instruction Sets and Data Formats","Peripheral Devices and Semiconductor Memory"],
		["Theory of random variables & Noise","Amplitude Modulation","Angle modulation","AM Transmitters and Recievers","Pulse Modulation","Data Transmission Schemes","Information Theory and Coding","Miscelleneous"],
		["Modelling of Control System and Transfer Function Approach","Block Diagram, Signal Flow Graph and feedback Characterstics of Control Systems","Time Response Analysis","Concepts of Stability","Root Locus Techniques","Frequency Response Analysis","Compensators and Controllers","State Space Analysis","Non-Linear Control Systems"],
		["Magnetic Circuits & Electromechanical Energy Conversion Systems","Transformers","Direct Current Machines","Synchronus Machines","Three Phase Induction Machine","Fractional Kilowatt Motors (Special Machies)"],
		["Generating Power Stations","Performance of Transmission Lines, Line parameters & cororna","Compensation Techniques and Voltage Profile Control","Distribution Systems, Cabels & Insulators","Fault Analysis","Load Flow studies","Power Sysytem Stability","Switch Gear and Protection","Optimal Power System Operation","HVDC Transmission, FACTs & Recent Trends in Power System","Per Unit System","Power System Transients"],
		["Power Semiconductor Devices","Diode Rectifiers","Phase controlled Rectifiers","Choppers","Inverters","Power Semiconductor Drives","Switched Mode Power Supply (SMPS)","Miscellaneous"],
		["Introduction to Signal & Systems","Continuous Time Fourier Series","Continous Time Fourier Transform (CTFT)","Laplace Transform","Sampling","Discrete Fourier Transform (DFT)","Z-Transform"],
		["Linear Algebra","Calculus","Differential Equation","Complex Variables","Probability & Statistics","Fourier Series","Partial Differential Equation"]
        ],
        subjectTopicsWeightage: [
          [0.0833333333333333,0.09,0.0766666666666667,0.0966666666666667,0.106666666666667,0.13,0.09,0.16,0.0766666666666667,0.09],
		[0.184519442406456,0.0817498165810712,0.25520909757887,0.127054292002935,0.174082905355833,0.0584739545121057,0.118910491562729],
		[0.224383050214672,0.174705992159791,0.139604256113496,0.162385663617696,0.0851969385850289,0.00492813141683778,0.149251446705245,0.0595445211872317],
		[0.010948905109489,0.408478382930938,0.266844469399214,0.182341381246491,0.131386861313869],
		[0.0701505817932923,0.0626830937713895,0.0719233401779603,0.272217659137577,0.306563997262149,0.0700752908966461,0.0934839151266256,0.0257973990417522,0.02217659137577,0,0.00492813141683778],
		[0.0296137339055794,0.186266094420601,0.170815450643777,0.0283261802575107,0.114163090128755,0.120600858369099,0.125751072961373,0.224463519313305],
		[0.271554252199413,0.0633431085043988,0.126686217008798,0.0950146627565982,0.443401759530792],
		[0.573846153846154,0.426153846153846],
		[0.0864073226544622,0.189107551487414,0.115423340961098,0.144118993135011,0.133684210526316,0.331258581235698],
		[0.237109375,0.240625,0.2828125,0.239453125],
		[0.120816326530612,0.271020408163265,0.161224489795918,0.11469387755102,0.0636734693877551,0.124489795918367,0.125714285714286,0.0183673469387755],
		[0.016039603960396,0.10179481777965,0.198795028439014,0.138710764693491,0.0833368443227301,0.146433536970718,0.215512955550874,0.0857130819464925,0.0136633663366337],
		[0.00589390962671906,0.227055312074958,0.176061659362249,0.257420281094151,0.249168807616745,0.0844000302251776],
		[0.0705155367231638,0.259427966101695,0.0776483050847458,0.120727401129943,0.117161016949153,0.0357697740112994,0.117161016949153,0.0622175141242938,0.0539194915254237,0.0778248587570621,0.0076271186440678,0],
		[0.366029411764706,0.0736274509803922,0.197598039215686,0.0818627450980392,0.110098039215686,0.0759803921568627,0.0409313725490196,0.0538725490196078],
		[0.163636363636364,0.122727272727273,0.163636363636364,0.190909090909091,0.109090909090909,0.163636363636364,0.0863636363636364],
		[0.142857142857143,0.0571428571428571,0.171428571428571,0.171428571428571,0.285714285714286,0.0857142857142857,0.0857142857142857]
        ]
      },
      {
        name: "Technical ESE Preparation",
        slug: "technical-ese",
        description: "Technical ESE electrical engineering preparation covering technical subjects",
        subjectName: ["Materials","Elec Cir","Elec Field","Measure","Electronics","Comp Funda","Ana Elec","Digi Elec","Micro","Comm Sys","Con Sys","Elec Mac","Pow Sys","Pow Elec","Sys & Sig","Eng Math"],
        subjectWeightage: [0.0981838476324122,0.120530507388029,0.0397127805441293,0.0813806192448519,0.0274206453930633,0.0508769185143981,0.0211697268607555,0.0378772961990804,0.0180833529550271,0.0282683025628302,0.109274028936862,0.11738655895542,0.100173671743023,0.0555966074749962,0.0367829587828545,0.0572821768122675],
        subjectTopicsName: [
          ["Introduction to Engineering materials","Dielectric Propeties of Materials","Magnetic Properties of materials","Conductive Materials","SemiConductor Materials","Superconductors","Miscelleneous"],
      ["Circuit Elements, Nodal and Mesh Analysis","Network Theorems","Transient response of DC and AC Networks, Sinusoidal Steady State Analysis","Second Order RLC Circuit, Resonance","Two Port Networks","Magnetically Coupled Circuits","Network Graph, Functions and Synthesis","Three Phase Circuit + Filters"],
      ["Coordinate Sysytems & Vector Calculus","Electrostatic Fields","Magnetostatic Fields","Time Varying Electromagnetic Fields","Miscelleneous"],
      ["Characterstics of Instruments and Measurements Systems","Measurements of Resistance and Potentiometers","AC Bridges","Galvanometers, Voltmeters & Ammeters","Measurement of Energy and Power","CRO & Frequency Measurement","Transducers & Sensors","Instrument Transformers","Digital Meter, Electrnic Instruments","Data Acquisition System, Recorders","Miscelleneous"],
      ["Semiconducters Physics","Smiconductor Diode, Characterstics Diode","BJT-Characterstics, Biasing and Thermal Stabilization","Field Effect Transistors","BJT & FET Amplifiers","Frequency Response","Feedback amplifiers","Oscillators"],
      ["Number System","Boolean Algebra","Memory Organization","Networking Fundamentals","Programming Languagee Methedology"],
      ["Operational Amplifiers Characterstics And Application","Basic of Filter Circuits, output Stage and Application"],
      ["Logic Gates and Switching Circuits","Conmbinational Logic Circuits","Sequentional Logic Circuits","Registers and Counters","Logic Families","A/D and D/A Converters"],
      ["Introduction to 8085 and its Functional Organization","Microprocessor Interfacing","Instruction Sets and Data Formats","Peripheral Devices and Semiconductor Memory"],
      ["Theory of random variables & Noise","Amplitude Modulation","Angle modulation","AM Transmitters and Recievers","Pulse Modulation","Data Transmission Schemes","Information Theory and Coding","Miscelleneous"],
      ["Modelling of Control System and Transfer Function Approach","Block Diagram, Signal Flow Graph and feedback Characterstics of Control Systems","Time Response Analysis","Concepts of Stability","Root Locus Techniques","Frequency Response Analysis","Compensators and Controllers","State Space Analysis","Non-Linear Control Systems"],
      ["Magnetic Circuits & Electromechanical Energy Conversion Systems","Transformers","Direct Current Machines","Synchronus Machines","Three Phase Induction Machine","Fractional Kilowatt Motors (Special Machies)"],
      ["Generating Power Stations","Performance of Transmission Lines, Line parameters & cororna","Compensation Techniques and Voltage Profile Control","Distribution Systems, Cabels & Insulators","Fault Analysis","Load Flow studies","Power Sysytem Stability","Switch Gear and Protection","Optimal Power System Operation","HVDC Transmission, FACTs & Recent Trends in Power System","Per Unit System","Power System Transients"],
      ["Power Semiconductor Devices","Diode Rectifiers","Phase controlled Rectifiers","Choppers","Inverters","Power Semiconductor Drives","Switched Mode Power Supply (SMPS)","Miscellaneous"],
      ["Introduction to Signal & Systems","Continuous Time Fourier Series","Continous Time Fourier Transform (CTFT)","Laplace Transform","Sampling","Discrete Fourier Transform (DFT)","Z-Transform"],
      ["Linear Algebra","Calculus","Differential Equation","Complex Variables","Probability & Statistics","Fourier Series","Partial Differential Equation"]
        ],
        subjectTopicsWeightage: [
          [0.184519442406456,0.0817498165810712,0.25520909757887,0.127054292002935,0.174082905355833,0.0584739545121057,0.118910491562729],
      [0.224383050214672,0.174705992159791,0.139604256113496,0.162385663617696,0.0851969385850289,0.00492813141683778,0.149251446705245,0.0595445211872317],
      [0.010948905109489,0.408478382930938,0.266844469399214,0.182341381246491,0.131386861313869],
      [0.0701505817932923,0.0626830937713895,0.0719233401779603,0.272217659137577,0.306563997262149,0.0700752908966461,0.0934839151266256,0.0257973990417522,0.02217659137577,0,0.00492813141683778],
      [0.0296137339055794,0.186266094420601,0.170815450643777,0.0283261802575107,0.114163090128755,0.120600858369099,0.125751072961373,0.224463519313305],
      [0.271554252199413,0.0633431085043988,0.126686217008798,0.0950146627565982,0.443401759530792],
      [0.573846153846154,0.426153846153846],
      [0.0864073226544622,0.189107551487414,0.115423340961098,0.144118993135011,0.133684210526316,0.331258581235698],
      [0.237109375,0.240625,0.2828125,0.239453125],
      [0.120816326530612,0.271020408163265,0.161224489795918,0.11469387755102,0.0636734693877551,0.124489795918367,0.125714285714286,0.0183673469387755],
      [0.016039603960396,0.10179481777965,0.198795028439014,0.138710764693491,0.0833368443227301,0.146433536970718,0.215512955550874,0.0857130819464925,0.0136633663366337],
      [0.00589390962671906,0.227055312074958,0.176061659362249,0.257420281094151,0.249168807616745,0.0844000302251776],
      [0.0705155367231638,0.259427966101695,0.0776483050847458,0.120727401129943,0.117161016949153,0.0357697740112994,0.117161016949153,0.0622175141242938,0.0539194915254237,0.0778248587570621,0.0076271186440678,0],
      [0.366029411764706,0.0736274509803922,0.197598039215686,0.0818627450980392,0.110098039215686,0.0759803921568627,0.0409313725490196,0.0538725490196078],
      [0.163636363636364,0.122727272727273,0.163636363636364,0.190909090909091,0.109090909090909,0.163636363636364,0.0863636363636364],
      [0.142857142857143,0.0571428571428571,0.171428571428571,0.171428571428571,0.285714285714286,0.0857142857142857,0.0857142857142857]
        ]
      },
      {
        name: "General ESE Preparation",
        slug: "general-ese",
        description: "General ESE electrical engineering preparation covering GS & EA",
        subjectName: ["GS & EA"],
        subjectWeightage: [1],
        subjectTopicsName: [
          ["CI","EA","EM","D&D","QP","EE","PM","MS","ICT","EV"]
        ],
        subjectTopicsWeightage: [
          [0.0833333333333333,0.09,0.0766666666666667,0.0966666666666667,0.106666666666667,0.13,0.09,0.16,0.0766666666666667,0.09]
        ]
      }
    ]
  },
    
    electronics: {
    preparationTypes: [
      {
        name: "Complete ESE Preparation",
        slug: "complete-ese",
        description: "Complete ESE electronics engineering preparation covering all subjects",
        subjectName: ["GS & EA","Net Theo","Elec Dev","Ana Cir","Digi Cir","Mat Sci","Elec Meas","Basic Electrical","Con Sys","Sig & Sys + DSP","EM","COA","Micro","Ana & Dig Comm","Adv Comm","Ad Electronics"],
        subjectWeightage: [0.125,0.072901936026936,0.0445822811447811,0.0624137205387205,0.0729608585858586,0.0548421717171717,0.0773284932659933,0.0655292508417508,0.100411405723906,0.0313247053872054,0.0842445286195286,0.0602777777777778,0.0230092592592593,0.0657502104377104,0.0490088383838384,0.0104145622895623],
        subjectTopicsName: [
          ["CI","EA","EM","D&D","QP","EE","PM","MS","ICT","EV"],
		["Basics of Network Analysis","Steady State Sinusoidal Analysis and Resonance","Network Theorems","Transient State Analysis","Two Port Network Parameters","Graph Theory and magnetically Coupled Circuits","Network Synthesis and Filters"],
		["Semiconductor Physics","PN-Junction Diodes","Bipolar Junction Transistors","Fiels Effect Transistors","Special Diodes and Optoelctronic Devices","Power Switching Devices"],
		["Diodes Circuits","BJT Circuits","FET and MOSFET Circuits","Frequency Response of Amplifiers and Filters","Feedback Amplifiers","Oscillators","Operational Amplifiers","Power Amplifiers & Regulators","Multivibrators & Timers"],
		["Number Systems","Boolean Algebra","Logic Gates","Combinational Circuits","Sequential Circuits","Memories & Programmable Logic Devices","Logic Families","ADC & DAC"],
		["Crystalline Structures","Dielectric & Ceramic Materials","Magnetic Materials","Conductors & Superconductors","Nano Materials"],
		["Basic of Measurement and Error Analysis","Indicating Type Instruments","Bridge Measurement & Q-meter","Electrical & Electronic Instrument","Cathode Ray Oscilloscope (CRO)","Digital System for Measurement","Transducers","Data Acquisition Systems & Telemetry Systems"],
		["Basics and Concepts of Induced EMF","Basic Of Transformers","Basics of Machines","Electrical Power Generation & Sources"],
		["Basic Block Diagram and Signal Flow Graphs","Time Domain Analysis","Routh-Hurwitz Stability Criterion","Root Locus","Frequency Domain Analysis","Compensators & Controllers","State Space Analysis"],
		["Basics of Signals & Systems","Continous and Discrete Time LTI Systems","Fourier Series","Continous Time Fourier Transform","laplace Transform","Sampling","Discrete Time Fourier Transform","Z-Transform","Digital Filters: Design And Applications"],
		["Vector Calculus & Maxwell's Equation","Uniform Plane Waves","Transmission Lines","Waveguides","Antennas & Radars"],
		["Basics of Computer Organisation & Architecture","I/O Organisation & Pipelining","Memory Organisation","Data Representation & Programming","Data Structures","Operating Systems & Data Bases","Miscelleneous"],
		["8085 Microprocessors","8086 Microprocessors","Interfacing Devices & Microcontrollers"],
		["Analog Communication System","Random Variables, Random Process and Noise","Digital Communication Systems","Information Theory"],
		["Communication & Cellular Networks","Microwave & Satellite Communication Systems","Fibre Optic Communication Systems"],
		["VLSI Topics"]
        ],
        subjectTopicsWeightage: [
          [0.0833333333333333,0.09,0.0766666666666667,0.0966666666666667,0.106666666666667,0.13,0.09,0.16,0.0766666666666667,0.09],
		[0.219314177283817,0.254960693955001,0.10185687178097,0.0990918948224451,0.126592572512876,0.130590946055842,0.0675928435890485],
		[0.241839270919635,0.153951946975973,0.0749792874896437,0.197663628831814,0.301143330571665,0.0304225352112676],
		[0.117173725151253,0.319835782195333,0.0134831460674157,0.124589455488332,0.0713742437337943,0.0168539325842697,0.267294727744166,0.05523768366465,0.0141573033707865],
		[0.0886612576064909,0.118904665314402,0.0735902636916836,0.161460446247464,0.232981744421907,0.0982150101419878,0.107971602434077,0.118215010141988],
		[0.0831531531531532,0.320810810810811,0.25963963963964,0.214324324324324,0.122072072072072],
		[0.180418388091022,0.1124598334317,0.047104728178897,0.151727982162765,0.079165846940783,0.0355957767722474,0.351793560233458,0.0417338841891272],
		[0.244580498866213,0.368526077097506,0.321859410430839,0.0650340136054422],
		[0.113758557355151,0.301452663215896,0.0939138420437469,0.0701536149607614,0.237472866922692,0.160085156119553,0.0231632993822007],
		[0.149251132009753,0.130442354580286,0.0225705329153605,0.0347962382445141,0.124799721351445,0.00658307210031348,0.0112852664576803,0.0479623824451411,0.472309299895507],
		[0.245300751879699,0.126691729323308,0.195300751879699,0.129887218045113,0.30281954887218],
		[0.0830758426966292,0.104950842696629,0.156566011235955,0.190273876404494,0.0886938202247191,0.318082865168539,0.0583567415730337],
		[0.551869158878505,0.111604361370716,0.336526479750779],
		[0.330034602076125,0.223598615916955,0.372110726643599,0.0742560553633218],
		[0.337479674796748,0.426341463414634,0.236178861788618],
		[1]
        ]
      },
      {
        name: "Technical ESE Preparation",
        slug: "technical-ese",
        description: "Technical ESE electronics engineering preparation covering technical subjects",
        subjectName: ["Net Theo","Elec Dev","Ana Cir","Digi Cir","Mat Sci","Elec Meas","Basic Electrical","Con Sys","Sig & Sys + DSP","EM","COA","Micro","Ana & Dig Comm","Adv Comm","Ad Electronics"],
        subjectWeightage: [0.0833164983164983,0.0509511784511785,0.0713299663299663,0.0833838383838384,0.0626767676767677,0.0883754208754209,0.0748905723905724,0.114755892255892,0.0357996632996633,0.0962794612794613,0.0688888888888889,0.0262962962962963,0.0751430976430976,0.056010101010101,0.0119023569023569],
        subjectTopicsName: [
          ["Basics of Network Analysis","Steady State Sinusoidal Analysis and Resonance","Network Theorems","Transient State Analysis","Two Port Network Parameters","Graph Theory and magnetically Coupled Circuits","Network Synthesis and Filters"],
        ["Semiconductor Physics","PN-Junction Diodes","Bipolar Junction Transistors","Fiels Effect Transistors","Special Diodes and Optoelctronic Devices","Power Switching Devices"],
        ["Diodes Circuits","BJT Circuits","FET and MOSFET Circuits","Frequency Response of Amplifiers and Filters","Feedback Amplifiers","Oscillators","Operational Amplifiers","Power Amplifiers & Regulators","Multivibrators & Timers"],
        ["Number Systems","Boolean Algebra","Logic Gates","Combinational Circuits","Sequential Circuits","Memories & Programmable Logic Devices","Logic Families","ADC & DAC"],
        ["Crystalline Structures","Dielectric & Ceramic Materials","Magnetic Materials","Conductors & Superconductors","Nano Materials"],
        ["Basic of Measurement and Error Analysis","Indicating Type Instruments","Bridge Measurement & Q-meter","Electrical & Electronic Instrument","Cathode Ray Oscilloscope (CRO)","Digital System for Measurement","Transducers","Data Acquisition Systems & Telemetry Systems"],
        ["Basics and Concepts of Induced EMF","Basic Of Transformers","Basics of Machines","Electrical Power Generation & Sources"],
        ["Basic Block Diagram and Signal Flow Graphs","Time Domain Analysis","Routh-Hurwitz Stability Criterion","Root Locus","Frequency Domain Analysis","Compensators & Controllers","State Space Analysis"],
        ["Basics of Signals & Systems","Continous and Discrete Time LTI Systems","Fourier Series","Continous Time Fourier Transform","laplace Transform","Sampling","Discrete Time Fourier Transform","Z-Transform","Digital Filters: Design And Applications"],
        ["Vector Calculus & Maxwell's Equation","Uniform Plane Waves","Transmission Lines","Waveguides","Antennas & Radars"],
        ["Basics of Computer Organisation & Architecture","I/O Organisation & Pipelining","Memory Organisation","Data Representation & Programming","Data Structures","Operating Systems & Data Bases","Miscelleneous"],
        ["8085 Microprocessors","8086 Microprocessors","Interfacing Devices & Microcontrollers"],
        ["Analog Communication System","Random Variables, Random Process and Noise","Digital Communication Systems","Information Theory"],
        ["Communication & Cellular Networks","Microwave & Satellite Communication Systems","Fibre Optic Communication Systems"],
        ["VLSI Topics"]
        ],
        subjectTopicsWeightage: [
          [0.219314177283817,0.254960693955001,0.10185687178097,0.0990918948224451,0.126592572512876,0.130590946055842,0.0675928435890485],
      [0.241839270919635,0.153951946975973,0.0749792874896437,0.197663628831814,0.301143330571665,0.0304225352112676],
      [0.117173725151253,0.319835782195333,0.0134831460674157,0.124589455488332,0.0713742437337943,0.0168539325842697,0.267294727744166,0.05523768366465,0.0141573033707865],
      [0.0886612576064909,0.118904665314402,0.0735902636916836,0.161460446247464,0.232981744421907,0.0982150101419878,0.107971602434077,0.118215010141988],
      [0.0831531531531532,0.320810810810811,0.25963963963964,0.214324324324324,0.122072072072072],
      [0.180418388091022,0.1124598334317,0.047104728178897,0.151727982162765,0.079165846940783,0.0355957767722474,0.351793560233458,0.0417338841891272],
      [0.244580498866213,0.368526077097506,0.321859410430839,0.0650340136054422],
      [0.113758557355151,0.301452663215896,0.0939138420437469,0.0701536149607614,0.237472866922692,0.160085156119553,0.0231632993822007],
      [0.149251132009753,0.130442354580286,0.0225705329153605,0.0347962382445141,0.124799721351445,0.00658307210031348,0.0112852664576803,0.0479623824451411,0.472309299895507],
      [0.245300751879699,0.126691729323308,0.195300751879699,0.129887218045113,0.30281954887218],
      [0.0830758426966292,0.104950842696629,0.156566011235955,0.190273876404494,0.0886938202247191,0.318082865168539,0.0583567415730337],
      [0.551869158878505,0.111604361370716,0.336526479750779],
      [0.330034602076125,0.223598615916955,0.372110726643599,0.0742560553633218],
      [0.337479674796748,0.426341463414634,0.236178861788618],
      [1]
        ]
      },
      {
        name: "General ESE Preparation",
        slug: "general-ese",
        description: "General ESE electronics engineering preparation covering GS & EA",
        subjectName: ["GS & EA"],
        subjectWeightage: [1],
        subjectTopicsName: [
          ["CI","EA","EM","D&D","QP","EE","PM","MS","ICT","EV"]
        ],
        subjectTopicsWeightage: [
          [0.0833333333333333,0.09,0.0766666666666667,0.0966666666666667,0.106666666666667,0.13,0.09,0.16,0.0766666666666667,0.09]
        ]
      }
    ]
  }
    };

    // MPPSC Exam Data
    const mppscExamData = {
      mppschindi: {
        preparationTypes: [
      {
        name: "Complete MPPSC Preparation Hindi",
        slug: "complete-mppsc-hindi",
        description: "Complete MPPSC Hindi preparation covering all subjects",
        subjectName:["प्राचीन इतिहास","मध्यकालीन इतिहास","आधुनिक इतिहास","भारत का भूगोल ","विश्व का भूगोल","जनसंख्या और शहरीकरण","भारतीय संविधान एवं राज्यव्यवस्था ","अर्थव्यवस्था","विज्ञान ","पर्यावरण एवं पारिस्थितिकी ","प्रादेशिक सामान्य ज्ञान ","तर्कशक्ति परिक्षण","गणित ","समसामयिकी","विविध"],
        subjectWeightage:[0.03490163901619,0.0222638035582061,0.0605375332706278,0.071544357501651,0.0415257459624968,0.00550341211551162,0.0658408213092117,0.0434269246933099,0.122876183233605,0.0125077548079809,0.161199943965258,0.0222137725389742,0.0305689527507054,0.117973143348876,0.187116011927395],
        subjectTopicsName:[ 
		["प्रागैतिहासिक काल","सैंधव सभ्यता","वैदिक सभ्यता","सूत्रकाल, महाकाव्य काल एवं संगम काल ","बौध्य,जैन,भागवत एवं शैव धर्म","मौर्य एवं मौर्योत्तर काल","गुप्तकाल एवं गुप्तोत्तर काल","800-1200  ई तक की राजनैतिक-सामाजिक स्थिति "],
		["दिल्ली सल्तनत","बहमनी एवं विजयनगर साम्राज्य","भक्ति आंदोलन","मुग़ल साम्राज्य","मराठा वंश"],
		["मुग़ल साम्राज्य का विघटन एवं यूरोपीय वाणिज्य का प्रारम्भ","1857 का विद्रोह एवं 19वी शताब्दी का जनांदोलन  ","सामाजिक सांस्कृतिक जाग्रति, निम्न जाति, मजदूर संघ एवं किसान आंदोलन","प्रमुख संस्थाएं, संधियां, आयोग, अधिनियम ","स्वतंत्रता संग्राम एवं राष्ट्रीय आंदोलन"],
		["भौतिक संरचना ","मानसून ","खनिज , शक्ति, संसाधन ","परिवहन "],
		["ब्रह्माण्ड और सावर मंडल","स्थलमण्डल  ","जल मंडल  ","वायु मंडल","आर्थिक भूगोल","मानव भूगोल "],
		["जनसंख्या और शहरीकरण"],
		["भारत का संवैधानिक विकास ","नागरिकता, मूल अधिकार, मूल कर्तव्य एवं राज्य के निति निदेशक तत्व ","संघ व् राज्य की कार्यपालिका एवं आपात उपबंध ","विधान मंडल: मंत्री परिषद् ","संघ राज्य सम्बन्ध, प्रशासन एवं जम्मू कश्मीर राज्य","वर्ग- विशेष उपबंध एवं अनुसूचित / जनजाति क्षेत्र","न्याय व्यवस्था (अनघ एवं राज्य )","निर्वाचन आयोग एवं राजभाषा","पंचायती राज, संविधान संशोधन एवं अनुसूचियाँ"],
		["विकासशील एवं विकसित अर्थव्यवस्था","गरीबी एवं बेरोजगारी","आर्थिक नियोजन एवं राष्ट्रीय आय/ बजट","कृषि, उद्योग एवं व्यापर","मुद्रा / बैंकिंग, कर प्रणाली एवं केंद्र-राज्य वित्तीय सम्बन्ध","भारत का विदेश व्यापर, आर्थिक संघटन एवं शेयर बाजार"],
		["भौतिक विज्ञान","रसायन विज्ञान ","वनस्पति विज्ञान","मानव चिकित्सा विज्ञान (जंतु विज्ञान)    ","कृषि, पशुपालन एवं डेरी","कम्प्यूटर्स","विज्ञान प्रौद्योगिकी "],
		["पर्यावरण एवं पारिस्थितिकी"],
		["प्रादेशिक सामान्य ज्ञान "],
		["तर्कशक्ति परिक्षण"],
		["गणित "],
		["समसामयिकी"],
		["विविध"]
		],
        subjectTopicsWeightage:[ 
	[0.0716698841698842,0.0796332046332046,0.0477799227799228,0.0995415057915058,0.147442084942085,0.143339768339768,0.211510617760618,0.199083011583012],
	[0.224891242670702,0.087573292982788,0.100435029317193,0.462076792131644,0.125023642897674],
	[0.107768204558088,0.0481517509727626,0.162798777098388,0.0941495275152863,0.587131739855475],
	[0.506937911571025,0.310442144873001,0.139934148635936,0.0426857949200376],
	[0.314488348530902,0.267477203647416,0.117021276595745,0.0668693009118541,0.133738601823708,0.100405268490375],
	[1],
	[0.0948760541783798,0.139215435727064,0.153910043444927,0.15819064656274,0.0674674163046256,0.160235113723486,0.0952593917710197,0.0507283414260159,0.0801175568617429],
	[0.0670731707317073,0.0319396051103368,0.230061943476578,0.143921796360821,0.360917537746806,0.166085946573751],
	[0.205804749340369,0.13007572902032,0.0396121029366412,0.23188157488949,0.0531473803241613,0.286331083164856,0.0531473803241613],
	[1],
	[1],
	[1],
	[1],
	[1],
	[1]
	]
}
        ]
      },
      
      mppscenglish: {
        preparationTypes: [
      {
        name: "Complete MPPSC English Preparation",
        slug: "complete-mppsc-english",
        description: "Complete MPPSC English preparation covering all subjects",
        subjectName:["Anc Hist","Med Hist","Mod Hist","Ind Geog","Wor Geog","Pop & Urb","Ind Const","Ind Eco","Science","Environ","MP GK","Reas","Maths ","CA","Misc"],
        subjectWeightage:[0.03490163901619,0.0222638035582061,0.0605375332706278,0.071544357501651,0.0415257459624968,0.00550341211551162,0.0658408213092117,0.0434269246933099,0.122876183233605,0.0125077548079809,0.161199943965258,0.0222137725389742,0.0305689527507054,0.117973143348876,0.187116011927395],
        subjectTopicsName:[ 
		["Pre Historic Period","Saindhav Civilisation","Vaidik Civilisation","Formula Period, Mahakavya Period & Sangam Period","Baudhya, Jain, Bhagwat & Shaiv Religion","Maurya & Post Maurya Period","Gupta Period","800-1200 AD Political & Social Status"],
		["Delhi Sultanate ","Bahmani And Vijayanagar Empire","Bhakti Revolution","Mughal Empire","Maratha Dynasty"],
		["Mughal Empire Dissolution & Beginning of European Commerce ","1857 Revolution & Early 19th Century","Social Cultural Awakening, Lower Caste, Labour & Farmer Revolution","Important Organisation, Treatites, Commision, Acts","Inpendence Struggle and Movements"],
		["Physical Features,Drainage System and Human Geography","Mansoon, Forest, Soil, Irrigation Nad Agricultural Projects","Minerals and Natural Resources, Industry and Commerce","Transportation"],
		["Universe and Solar System","Lithosphere","Hydrosphere","Atmosphere","Economic Geography","Human Geography"],
		["Population & Urbanisation"],
		["Constitutional Development of India","Citizenship, Fundamental Rights and Duties, Principles of State Policies","State Executives and Emergency Provisions","Cabunet and Legislature","Union State Relations, Administration and Jammu & Kashmir State","Categories special Provisions, SC/ST Regions","Judiciary System","Election Commision and National Language","Panchyati Rajya, Constitution Ammendments and Schedules"],
		["Developing and Developed Economies","Poverty and Unemployment","Economic Planning and National Income and Budget","Agriculture, Industries and Commerce","Monetry Banking, Taxation, State Center Financial Relation","Indian Foreign Trade, Economic Organization and Share Market"],
		["Physics","Chemistry","Biology","Medical Science","Agriculture, Vetenary and Dairy Science","Computers","Science and Technology"],
		["Environment and Ecology "],
		["MP GK"],
		["Reasoning"],
		["Maths"],
		["Current Affairs"],
		["Misclleneous"]
		],
        subjectTopicsWeightage:[ 
	[0.0716698841698842,0.0796332046332046,0.0477799227799228,0.0995415057915058,0.147442084942085,0.143339768339768,0.211510617760618,0.199083011583012],
	[0.224891242670702,0.087573292982788,0.100435029317193,0.462076792131644,0.125023642897674],
	[0.107768204558088,0.0481517509727626,0.162798777098388,0.0941495275152863,0.587131739855475],
	[0.506937911571025,0.310442144873001,0.139934148635936,0.0426857949200376],
	[0.314488348530902,0.267477203647416,0.117021276595745,0.0668693009118541,0.133738601823708,0.100405268490375],
	[1],
	[0.0948760541783798,0.139215435727064,0.153910043444927,0.15819064656274,0.0674674163046256,0.160235113723486,0.0952593917710197,0.0507283414260159,0.0801175568617429],
	[0.0670731707317073,0.0319396051103368,0.230061943476578,0.143921796360821,0.360917537746806,0.166085946573751],
	[0.205804749340369,0.13007572902032,0.0396121029366412,0.23188157488949,0.0531473803241613,0.286331083164856,0.0531473803241613],
	[1],
	[1],
	[1],
	[1],
	[1],
	[1]
	]
}
        ]
      }
    };

// Helper function to create subjects from subject data
    function createSubjectsFromData(subjectData) {
      return subjectData.subjectName.map((name, subjectIndex) => {
        const topics = subjectData.subjectTopicsName[subjectIndex].map((topicName, topicIndex) => ({
          name: topicName,
          weight: subjectData.subjectTopicsWeightage[subjectIndex][topicIndex]
        }));

        return {
          name,
          weight: subjectData.subjectWeightage[subjectIndex],
          topics
        };
      });
    }

    // Create exam configurations
    const examConfigs = [
      {
        name: 'GATE',
        slug: 'gate',
        description: 'Graduate Aptitude Test in Engineering - National level examination for admissions to postgraduate programs',
        data: gateExamData
      },
      {
        name: 'ESE',
        slug: 'ese',
        description: 'Engineering Services Examination - Civil services examination for recruitment to various technical services',
        data: eseExamData
      },
      {
        name: 'MPPSC',
        slug: 'mppsc',
        description: 'Madhya Pradesh Public Service Commission - State level civil services examination',
        data: mppscExamData
      }
    ];

    // Create exams with new structure
    for (const examConfig of examConfigs) {
      const streams = [];

      for (const [streamKey, streamData] of Object.entries(examConfig.data)) {
        const preparationTypes = [];

        for (const prepTypeData of streamData.preparationTypes) {
  const subjects = createSubjectsFromData(prepTypeData);  // ← FIXED
  preparationTypes.push({
    name: prepTypeData.name,
    slug: prepTypeData.slug,
    description: prepTypeData.description,
    subjects,
    isActive: true
  });
}

        streams.push({
          name: streamKey.charAt(0).toUpperCase() + streamKey.slice(1).replace(/([A-Z])/g, ' $1').trim(),
          slug: streamKey,
          preparationTypes,
          isActive: true
        });
      }

      if (streams.length === 0) {
        console.log(`⚠️ No valid streams found for ${examConfig.name}, skipping`);
        continue;
      }

      const exam = new Exam({
        name: examConfig.name,
        slug: examConfig.slug,
        description: examConfig.description,
        streams,
        isActive: true
      });

      await exam.save();
      console.log(`✅ Created exam: ${examConfig.name} with ${streams.length} streams`);
    }

    console.log('🎉 Enhanced exam data initialization completed successfully!');

    // Print detailed summary
    const examCount = await Exam.countDocuments();
    const exams = await Exam.find({});
    
    console.log('\n📊 Detailed Summary:');
    console.log(`- Total exams created: ${examCount}`);
    
    exams.forEach(exam => {
      console.log(`\n- ${exam.name}:`);
      exam.streams.forEach(stream => {
        console.log(`  └─ ${stream.name}:`);
        stream.preparationTypes.forEach(prepType => {
          console.log(`      ├─ ${prepType.name} (${prepType.subjects.length} subjects)`);
        });
      });
    });

  } catch (error) {
    console.error('❌ Error initializing exam data:', error);
    console.error('Full error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    try {
      await mongoose.disconnect();
      console.log('📋 Database connection closed');
    } catch (closeError) {
      console.error('Error closing database connection:', closeError);
    }

    if (require.main === module) {
      process.exit(0);
    }
  }
}

// Run the initialization
if (require.main === module) {
  initExams();
}

module.exports = initExams;
