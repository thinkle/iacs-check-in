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
             options : ['Honda','Toyota'],
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
