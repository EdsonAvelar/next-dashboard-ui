import { Day, PrismaClient, UserSex } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

async function main() {
  // Cria hash da senha (o número 10 é o salt rounds)'
  const passwordHash = await bcrypt.hash("12345", 10);

  // Cria o usuário admin
  await prisma.user.create({
    data: {
      name: "Gerente",
      avatar: "", // você pode definir um avatar padrão
      email: "gerente@com.br",
      password: passwordHash,
      roles: {
        create: [{ name: "gerente_geral", descricao: "gerente geral" }],
      },
      status: 1, // supondo que 1 seja ativo
      // Outros campos podem ser deixados como null ou definidos conforme necessário
    },
  });

  console.log("Usuário admin criado com sucesso!");

  const cargoData = [
    { name: "Gerente" },
    { name: "Vendedor" },
    { name: "Coordenador" },
    { name: "Gerente Adminstrativo" },
    { name: "Auxiliar Adminstrativo" },
    { name: "Pós-Venda" },
  ];

  for (const name of cargoData) {
    await prisma.cargo.create({ data: name });
  }

  console.log("Cargos criados com sucesso!");

  // Cria o funil
  const funil = await prisma.funil.create({
    data: {
      nome: "VENDAS",
    },
  });

  // Cria as etapas do funil em uma única operação com createMany
  await prisma.etapaFunil.createMany({
    data: [
      {
        nome: "OPORTUNIDADE",
        ordem: 1,
        funil_id: funil.id,
        tipo: "COMUM", // etapa de agendamento
      },
      {
        nome: "PRIMEIRO_CONTATO",
        ordem: 2,
        funil_id: funil.id,
        tipo: "COMUM", // etapa de agendamento
      },
      {
        nome: "REUNIAO_AGENDADA",
        ordem: 3,
        funil_id: funil.id,
        tipo: "AGENDAMENTO", // etapa de agendamento
      },
      {
        nome: "REUNIAO",
        ordem: 4,
        funil_id: funil.id,
        tipo: "REUNIAO", // etapa de reunião
      },
      {
        nome: "APROVACAO",
        ordem: 5,
        funil_id: funil.id,
        tipo: "COMUM", // etapa de aprovação
      },
      {
        nome: "ACOMPANHAMENTO",
        ordem: 6,
        funil_id: funil.id,
        tipo: "COMUM", // exemplo: etapa de reunião para acompanhamento
      },
      {
        nome: "FECHAMENTO",
        ordem: 7,
        funil_id: funil.id,
        tipo: "FECHAMENTO", // etapa de aprovação para fechamento
      },
    ],
  });

  console.log('Pipeline "VENDAS" criado com sucesso!');

  // ####################################################################
  // Exemplos que devem ser apagados
  // ####################################################################

  // ADMIN
  await prisma.admin.create({
    data: {
      id: "admin1",
      username: "admin1",
    },
  });
  await prisma.admin.create({
    data: {
      id: "admin2",
      username: "admin2",
    },
  });

  // GRADE
  for (let i = 1; i <= 6; i++) {
    await prisma.grade.create({
      data: {
        level: i,
      },
    });
  }

  // CLASS
  for (let i = 1; i <= 6; i++) {
    await prisma.class.create({
      data: {
        name: `${i}A`,
        gradeId: i,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const subjectData = [
    { name: "Mathematics" },
    { name: "Science" },
    { name: "English" },
    { name: "History" },
    { name: "Geography" },
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Biology" },
    { name: "Computer Science" },
    { name: "Art" },
  ];

  for (const subject of subjectData) {
    await prisma.subject.create({ data: subject });
  }

  // TEACHER
  for (let i = 1; i <= 15; i++) {
    await prisma.teacher.create({
      data: {
        id: `teacher${i}`, // Unique ID for the teacher
        username: `teacher${i}`,
        name: `TName${i}`,
        surname: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        classes: { connect: [{ id: (i % 6) + 1 }] },
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - 30)
        ),
      },
    });
  }

  // LESSON
  for (let i = 1; i <= 30; i++) {
    await prisma.lesson.create({
      data: {
        name: `Lesson${i}`,
        day: Day[
          Object.keys(Day)[
            Math.floor(Math.random() * Object.keys(Day).length)
          ] as keyof typeof Day
        ],
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        subjectId: (i % 10) + 1,
        classId: (i % 6) + 1,
        teacherId: `teacher${(i % 15) + 1}`,
      },
    });
  }

  // PARENT
  for (let i = 1; i <= 25; i++) {
    await prisma.parent.create({
      data: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: `PName ${i}`,
        surname: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
      },
    });
  }

  // STUDENT
  for (let i = 1; i <= 50; i++) {
    await prisma.student.create({
      data: {
        id: `student${i}`,
        username: `student${i}`,
        name: `SName${i}`,
        surname: `SSurname ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
        birthday: new Date(
          new Date().setFullYear(new Date().getFullYear() - 10)
        ),
      },
    });
  }

  // EXAM
  for (let i = 1; i <= 10; i++) {
    await prisma.exam.create({
      data: {
        title: `Exam ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // ASSIGNMENT
  for (let i = 1; i <= 10; i++) {
    await prisma.assignment.create({
      data: {
        title: `Assignment ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // RESULT
  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 90,
        studentId: `student${i}`,
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
      },
    });
  }

  // ATTENDANCE
  for (let i = 1; i <= 10; i++) {
    await prisma.attendance.create({
      data: {
        date: new Date(),
        present: true,
        studentId: `student${i}`,
        lessonId: (i % 30) + 1,
      },
    });
  }

  // EVENT
  for (let i = 1; i <= 5; i++) {
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: (i % 5) + 1,
      },
    });
  }

  // ANNOUNCEMENT
  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classId: (i % 5) + 1,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
