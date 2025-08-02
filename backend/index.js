// backend/index.js
app.get('/students', (req, res) => {
  const students = [
    {
      name: 'Ashish Prajapati',
      rollNo: '101',
      marks: {
        math: 85,
        english: 78,
        science: 92
      },
    },
    {
      name: 'Riya Sharma',
      rollNo: '102',
      marks: {
        math: 65,
        english: 70,
        science: 60
      },
    }
  ];
  
  res.json(students);
});
