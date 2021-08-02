import { PrismaClient } from '.prisma/client'

export const addCausesFixture = async (prisma: PrismaClient) => {
  await prisma.cause.createMany({
    data: [
      {
        id: 1,
        name: 'Carpathia Foundation',
        site: 'https://www.carpathia.org/',
        image: 'causes/carpathia.jpg',
      },
      {
        id: 2,
        name: 'The Salvation Army',
        site: 'http://www.salvationarmy.org/',
        image: 'causes/salvationarmy.jpg',
      },
      {
        id: 3,
        name: 'Sea Turtle Conservancy',
        site: 'http://www.conserveturtles.org/',
        image: 'causes/stc.jpg',
      },
      {
        id: 4,
        name: 'Feeding America',
        site: 'http://www.feedingamerica.org/',
        image: 'causes/feedingamerica.jpg',
      },
      {
        id: 5,
        name: 'Scholarship America',
        site: 'http://www.scholarshipamerica.org/',
        image: 'causes/scholarshipamerica.jpg',
      },
      {
        id: 6,
        name: 'Keep America Beautiful',
        site: 'https://www.kab.org/',
        image: 'caues/kap.jpg',
      },
      {
        id: 7,
        name: 'Autism Speaks',
        site: 'http://www.autismspeaks.org/',
        image: 'causes/autismspeaks.jpg',
      },
      {
        id: 8,
        name: 'American Civil Liberties Union',
        site: 'http://aclu.org',
        image: 'causes/americanheart.png',
      },
      {
        id: 9,
        name: 'Habitat for Humanity',
        site: 'https://www.habitat.org/',
        image: 'causes/habitatforhumanity.jpg',
      },
      {
        id: 10,
        name: 'Coral Reef Alliance',
        site: 'http://coral.org/',
        image: 'causes/coralalliance.jpg',
      },
      {
        id: 11,
        name: 'Wounded Warrior Project',
        site: 'https://www.woundedwarriorproject.org/',
        image: 'causes/woundedwarrior.jpg',
      },
      {
        id: 12,
        name: "Alzheimer's Association",
        site: 'https://www.alz.org/',
        image: 'causes/alzheimers.jpg',
      },
      {
        id: 13,
        site: 'https://www.heart.org/',
        name: 'American Heart Association',
        image: 'causes/americanheart.png',
      },
      {
        id: 14,
        name: "St. Jude Children's Research Hospital",
        site: 'http://www.stjude.org/',
        image: 'causes/stjudes.jpg',
      },
      {
        id: 15,
        name: 'Rainforest Action Network',
        site: 'https://www.ran.org/',
        image: 'causes/rainforestaction.jpg',
      },
      {
        id: 16,
        name: 'American Cancer Society',
        site: 'http://www.cancer.org/',
        image: 'causes/americancancer.jpg',
      },
      {
        id: 17,
        name: 'Operation Honey Bee',
        site: 'https://www.operationhoneybee.com/',
        image: 'causes/operationhoneybee.jpg',
      },
    ],
  })
}
