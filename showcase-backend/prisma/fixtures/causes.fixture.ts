import { PrismaClient } from '.prisma/client'

export const addCausesFixture = async (prisma: PrismaClient) => {
  await prisma.cause.createMany({
    data: [
      {
        id: 1,
        name: 'Carpathia Foundation',
        site: 'https://www.carpathia.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fcarpathia.jpg?alt=media',
        balanceEUR: 0.55,
        numberOfContributions: 1,
      },
      {
        id: 2,
        name: 'The Salvation Army',
        site: 'http://www.salvationarmy.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fsalvationarmy.jpg?alt=media',
      },
      {
        id: 3,
        name: 'Sea Turtle Conservancy',
        site: 'http://www.conserveturtles.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fstc.jpg?alt=media',
      },
      {
        id: 4,
        name: 'Feeding America',
        site: 'http://www.feedingamerica.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Ffeedingamerica.jpg?alt=media',
      },
      {
        id: 5,
        name: 'Scholarship America',
        site: 'http://www.scholarshipamerica.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fscholarshipamerica.jpg?alt=media',
      },
      {
        id: 6,
        name: 'Keep America Beautiful',
        site: 'https://www.kab.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fkap.jpg?alt=media',
      },
      {
        id: 7,
        name: 'Autism Speaks',
        site: 'http://www.autismspeaks.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fautismspeaks.jpg?alt=media',
      },
      {
        id: 8,
        name: 'American Civil Liberties Union',
        site: 'http://aclu.org',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Famericanheart.png?alt=media',
      },
      {
        id: 9,
        name: 'Habitat for Humanity',
        site: 'https://www.habitat.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fhabitatforhumanity.jpg?alt=media',
      },
      {
        id: 10,
        name: 'Coral Reef Alliance',
        site: 'http://coral.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fcoralalliance.jpg?alt=media',
      },
      {
        id: 11,
        name: 'Wounded Warrior Project',
        site: 'https://www.woundedwarriorproject.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fwoundedwarrior.jpg?alt=media',
      },
      {
        id: 12,
        name: "Alzheimer's Association",
        site: 'https://www.alz.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Falzheimers.jpg?alt=media',
      },
      {
        id: 13,
        site: 'https://www.heart.org/',
        name: 'American Heart Association',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Famericanheart.png?alt=media',
      },
      {
        id: 14,
        name: "St. Jude Children's Research Hospital",
        site: 'http://www.stjude.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Fstjudes.jpg?alt=media',
      },
      {
        id: 15,
        name: 'Rainforest Action Network',
        site: 'https://www.ran.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Frainforestaction.jpg?alt=media',
      },
      {
        id: 16,
        name: 'American Cancer Society',
        site: 'http://www.cancer.org/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Famericancancer.jpg?alt=media',
      },
      {
        id: 17,
        name: 'Operation Honey Bee',
        site: 'https://www.operationhoneybee.com/',
        image:
          'https://firebasestorage.googleapis.com/v0/b/showcase-app-2b04e.appspot.com/o/causes%2Foperationhoneybee.jpg?alt=media',
      },
    ],
  })
}
