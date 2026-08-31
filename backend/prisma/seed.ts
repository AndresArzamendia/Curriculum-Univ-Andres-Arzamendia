import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@arzamendia.dev";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Andres Arzamendia",
      role: "admin",
    },
  });

  await prisma.profile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Andres Arzamendia",
      title: "Estudiante de Ingeniería en Informática",
      bio: "Estudiante de Ingeniería en Informática apasionado por el desarrollo de software, la electrónica y la física cuántica. Con enfoque en soluciones tecnológicas innovadoras que combinan hardware y software.",
      email: "andres.arzamendia@email.com",
      phone: "+54 9 11 0000-0000",
      location: "Buenos Aires, Argentina",
      linkedin: "https://linkedin.com/in/andres-arzamendia",
      github: "https://github.com/andres-arzamendia",
      whatsapp: "+5491100000000",
    },
  });

  const skills = [
    { name: "JavaScript", level: 85, category: "Lenguajes", order: 1 },
    { name: "TypeScript", level: 80, category: "Lenguajes", order: 2 },
    { name: "Python", level: 75, category: "Lenguajes", order: 3 },
    { name: "C/C++", level: 65, category: "Lenguajes", order: 4 },
    { name: "SQL", level: 70, category: "Lenguajes", order: 5 },
    { name: "React / Next.js", level: 82, category: "Frameworks", order: 1 },
    { name: "Node.js / Express", level: 78, category: "Frameworks", order: 2 },
    { name: "Tailwind CSS", level: 85, category: "Frameworks", order: 3 },
    { name: "Django / Flask", level: 60, category: "Frameworks", order: 4 },
    { name: "Arduino", level: 70, category: "Electrónica/Hardware", order: 1 },
    { name: "Raspberry Pi", level: 65, category: "Electrónica/Hardware", order: 2 },
    { name: "Circuitos Analógicos", level: 55, category: "Electrónica/Hardware", order: 3 },
    { name: "Git / GitHub", level: 85, category: "Herramientas", order: 1 },
    { name: "Docker", level: 60, category: "Herramientas", order: 2 },
    { name: "VS Code", level: 90, category: "Herramientas", order: 3 },
    { name: "Linux", level: 70, category: "Herramientas", order: 4 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  await prisma.project.create({
    data: {
      title: "Portfolio Web Interactivo",
      description:
        "Sitio web de portafolio personal con panel de administración, animaciones avanzadas y diseño responsive. Construido con Next.js, Express y Prisma.",
      tags: JSON.stringify(["Next.js", "TypeScript", "Prisma", "Express"]),
      category: "Frontend",
      featured: true,
      order: 1,
    },
  });

  await prisma.project.create({
    data: {
      title: "Sistema de Monitoreo IoT",
      description:
        "Sistema de monitoreo ambiental con sensores DHT22, Arduino y Raspberry Pi. Visualización de datos en tiempo real con dashboard web.",
      tags: JSON.stringify(["Arduino", "Raspberry Pi", "Python", "IoT"]),
      category: "IoT/Electrónica",
      featured: true,
      order: 2,
    },
  });

  await prisma.project.create({
    data: {
      title: "API RESTful de Gestión",
      description:
        "API completa con autenticación JWT, CRUD, paginación y documentación Swagger. Desarrollada con Express y PostgreSQL.",
      tags: JSON.stringify(["Node.js", "Express", "PostgreSQL", "JWT"]),
      category: "Backend",
      featured: true,
      order: 3,
    },
  });

  await prisma.certificate.create({
    data: {
      title: "Ingeniería en Informática",
      issuer: "Universidad Nacional",
      date: new Date("2023-03-01"),
    },
  });

  await prisma.metric.create({
    data: {
      event: "system_init",
      metadata: JSON.stringify({ message: "Database seeded successfully" }),
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
