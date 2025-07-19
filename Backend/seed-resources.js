const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleResources = [
  {
    title: "Data Structures & Algorithms Complete Guide",
    type: "PDF",
    semester: "3rd",
    subject: "Computer Science",
    url: "https://example.com/dsa-guide.pdf"
  },
  {
    title: "Machine Learning Fundamentals",
    type: "Video",
    semester: "5th",
    subject: "Artificial Intelligence",
    url: "https://example.com/ml-fundamentals.mp4"
  },
  {
    title: "Database Management Systems",
    type: "PDF",
    semester: "4th",
    subject: "Computer Science",
    url: "https://example.com/dbms-notes.pdf"
  },
  {
    title: "Web Development Bootcamp",
    type: "Video",
    semester: "3rd",
    subject: "Web Development",
    url: "https://example.com/web-dev-course.mp4"
  },
  {
    title: "Cybersecurity Essentials",
    type: "PDF",
    semester: "5th",
    subject: "Cybersecurity",
    url: "https://example.com/cybersecurity.pdf"
  },
  {
    title: "Mathematics for Computer Science",
    type: "PDF",
    semester: "2nd",
    subject: "Mathematics",
    url: "https://example.com/math-cs.pdf"
  },
  {
    title: "Cloud Computing & AWS",
    type: "Video",
    semester: "6th",
    subject: "Cloud Computing",
    url: "https://example.com/aws-course.mp4"
  },
  {
    title: "Software Engineering Principles",
    type: "PDF",
    semester: "4th",
    subject: "Software Engineering",
    url: "https://example.com/software-eng.pdf"
  }
];

async function seedResources() {
  try {
    console.log('Starting to seed resources...');
    
    // Clear existing resources
    await prisma.resource.deleteMany({});
    console.log('Cleared existing resources');
    
    // Insert new resources
    for (const resource of sampleResources) {
      await prisma.resource.create({
        data: resource
      });
    }
    
    console.log('Successfully seeded resources!');
    
    // Verify the resources were created
    const resources = await prisma.resource.findMany();
    console.log(`Created ${resources.length} resources:`);
    resources.forEach(r => console.log(`- ${r.title} (${r.type})`));
    
  } catch (error) {
    console.error('Error seeding resources:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedResources();