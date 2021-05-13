import { firestore as db } from '../../services/firestore'

export const getCauses = (req, res) => {
  db.collection('causes')
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        return res.status(422).send({ error: 'No causes' })
      }

      let docs = snapshot.docs.map((x) => x.data())

      return res.json({ causes: docs })
    })
    .catch((e) => {
      console.log('Error getting documents', e)
      return res.status(422).send({ error: e })
    })
}
