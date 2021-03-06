const fieldsets = [
    {
        title : 'Info',
        fields : [
            {
                key : 'first',
                outStyle : {fontWeight:'bold'},
                type:'text',
                validationType:'formal',
            },
            {
                key : 'last',
                outStyle : {fontWeight: 'bold'},
                type:'text',
                validationType:'formal'
            },
            // {
            //     key : 'name',
            //     outStyle : {fontWeight:'bold'},
            //     type : 'text',
            //     validationType:'formal',
            // },
            {
                key : 'role',
                type : 'choice',
                outStyle : {fontSize: '0.7rem',fontStyle:'italic',color:'#333'},
                options : [
                    'Volunteer',
                    'Family',
                    'Vendor',
                    'Visitor',
                    'College Representative',
                    'Consultant',
                    'Substitute',
              ]
            },
            {
                key : 'purpose',
                type : 'choice',
                outStyle : {fontSize: '0.7rem',fontStyle:'italic',color:'#333'},
                options : [
                    'Meeting',              
                    'Consultation',
                    'Conference',
                    'Volunteer',
                    'Substitute',
                ]
            },
            // {
            //     type : 'text',
            //     key: 'phone',
            //     validationType : 'phone',
            // },
        ],
    },
    {title : 'Vehicle',
     fields : [
         {
             key : 'make',
             type : 'choice',
             options : [
                 "Acura",
                 "Alfa Romeo",
                 "Aston Martin",
                 "Audi",
                 "Bentley",
                 "BMW",
                 "Bugatti",
                 "Buick",
                 "Cadillac",
                 "Caterham",
                 "Chevrolet",
                 "Chrysler",
                 "Dodge",
                 "Ferrari",
                 "Fiat",
                 "Ford",
                 "GMC",
                 "Honda",
                 "Hyundai",
                 "Infiniti",
                 "Jaguar",
                 "Jeep",
                 "Kia",
                 "Lamborghini",
                 "Land Rover",
                 "Lexus",
                 "Lincoln",
                 "Lotus",
                 "Maserati",
                 "Mazda",
                 "Mercedes Benz",
                 "Mini",
                 "Mitsubishi",
                 "Nissan",
                 "Porsche",
                 "Ram Trucks",
                 "Rolls Royce",
                 "Smart",
                 "Subaru",
                 "Toyota",
                 "Tesla",
                 "Volkswagen",
                 "Volvo",
             ],
         },
         {key:'model',
          type:'text'},
         {key:'license',
          type:'text',
          validationType:'allcaps'},
     ],
    },
    {title : 'Checkin Data',
     noEntry : true,
     fields : [
         {key:'timestamp',
          parse : (s)=>new Date(s),
          formatValue : (ts)=>ts.toLocaleTimeString && ts.toLocaleTimeString() || new Date(ts).toLocaleTimeString()
         },
         {key:'out',
          parse : (s)=>new Date(s),
          formatValue : (isOut)=>!isOut&&'In'||isOut.toLocaleTimeString && isOut.toLocaleTimeString() || new Date(isOut).toLocaleTimeString(),
         }
          
     ],
    },
]

const required = [
    'first',
    'last',
    'role',
    'purpose'
];

export default fieldsets;
export {required}
