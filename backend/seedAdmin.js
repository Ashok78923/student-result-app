const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = new User({
    username: 'admin',
    password: hashedPassword,
  });

  await adminUser.save();
  console.log('✅ Admin user created');
  mongoose.disconnect();
};

seedAdmin();