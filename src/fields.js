const fieldsets = [
    {
        title : 'Info',
        fields : [
            {
                key : 'name',
                type : 'text'
            },
            {
                key : 'role',
                type : 'choice',
                options : [
                  'Volunteer',
                  'Vendor',
                  'Visitor',
                  'Family',
                  'College Representative',
                  'Consultant',
              ]
            },
            {
                key : 'purpose',
                type : 'choice',
                options : [
                  'Meeting',              
                  'Consultation',
                  'Conference',
                  'Volunteer'
                ]
            },
            {
                type : 'text',
                key: 'phone',
                validationType : 'phone',
            },
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
          formatValue : (ts)=>ts.toLocaleTimeString()
         },
         {key:'out',
          parse : (s)=>new Date(s),
          formatValue : (isOut)=>!isOut&&'In'||isOut.toLocaleTimeString()
         }
          
     ],
    },
]

export default fieldsets;
