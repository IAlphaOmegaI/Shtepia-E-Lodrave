import PageHeader from '@/components/common/page-header';

export default function TermsConditionsPage() {
  return (
    <div>
      <PageHeader title="Kushtet e Përdorimit" />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold mb-6">1. Pranueshmëria e Kushteve</h2>
            <p className="mb-4">
              Duke përdorur faqen tonë të internetit Shtëpia e Lodrave, ju pranoni të jeni të detyruar nga këto kushte përdorimi, 
              të gjitha ligjet dhe rregulloret e zbatueshme, dhe pranoni se jeni përgjegjës për përputhjen me çdo ligj lokal të 
              zbatueshëm. Nëse nuk pajtoheni me ndonjë nga këto kushte, ju ndalohet të përdorni ose të hyni në këtë faqe.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-8">2. Përdorimi i Faqes</h2>
            <p className="mb-4">
              Lejohet të shkarkoni një kopje të materialeve në faqen e internetit të Shtëpia e Lodrave vetëm për përdorim 
              personal, jo-komercial. Kjo është dhënia e një licence, jo një transferim i titullit, dhe nën këtë licencë ju nuk mund:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>të modifikoni ose kopjoni materialet;</li>
              <li>të përdorni materialet për çdo qëllim komercial ose për çdo shfaqje publike;</li>
              <li>të përpiqeni të dekompiloni ose të bëni inxhinieri të kundërt të çdo software-i që gjendet në faqen e internetit;</li>
              <li>të hiqni çdo të drejtë autori ose shënimet e tjera të pronësisë nga materialet.</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-8">3. Regjistrimi dhe Llogaria</h2>
            <p className="mb-4">
              Për të blerë produkte në faqen tonë, duhet të krijoni një llogari. Ju jeni përgjegjës për:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Sigurimin e informacionit të saktë dhe të plotë gjatë regjistrimit</li>
              <li>Mbajtjen e konfidencialitetit të fjalëkalimit tuaj</li>
              <li>Të gjitha aktivitetet që ndodhin nën llogarinë tuaj</li>
              <li>Njoftimin e menjëhershëm për çdo përdorim të paautorizuar të llogarisë suaj</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-8">4. Produktet dhe Çmimet</h2>
            <p className="mb-4">
              Ne bëjmë çdo përpjekje për të shfaqur sa më saktë ngjyrat dhe imazhet e produkteve tona. Megjithatë, nuk mund të 
              garantojmë që ekrani i kompjuterit tuaj të shfaqë saktë ngjyrat.
            </p>
            <p className="mb-4">
              Çmimet e produkteve tona janë subjekt i ndryshimit pa njoftim paraprak. Ne rezervojmë të drejtën të refuzojmë 
              çdo porosi që vendosni me ne. Ne mund, sipas gjykimit tonë, të kufizojmë ose anulojmë sasitë e blera për person, 
              për familje ose për porosi.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-8">5. Pagesa dhe Siguria</h2>
            <p className="mb-4">
              Ne pranojmë pagesa përmes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Kartave të kreditit/debitit (Visa, Mastercard)</li>
              <li>Transfertë bankare</li>
              <li>Pagesë në dorëzim (vetëm për zona të caktuara)</li>
            </ul>
            <p className="mb-4">
              Të gjitha transaksionet e pagesave janë të enkriptuara dhe të sigurta. Ne nuk ruajmë informacionet e kartës 
              suaj të kreditit në sistemet tona.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-8">6. Dërgimi dhe Dorëzimi</h2>
            <p className="mb-4">
              Ne dërgojmë në të gjithë Shqipërinë. Koha e dorëzimit varion nga 3-5 ditë pune, në varësi të vendndodhjes suaj. 
              Tarifat e transportit llogariten bazuar në peshën e porosisë dhe destinacionin.
            </p>
            <p className="mb-4">
              Ju do të merrni një email konfirmimi me detajet e gjurmimit pasi porosia juaj të jetë dërguar.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-8">7. Kthimet dhe Rimbursimi</h2>
            <p className="mb-4">
              Ne pranojmë kthime brenda 14 ditëve nga data e dorëzimit. Produktet duhet të jenë:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Të papërdorura dhe në gjendjen origjinale</li>
              <li>Me të gjitha etiketat dhe paketimin origjinal</li>
              <li>Me faturën e blerjes</li>
            </ul>
            <p className="mb-4">
              Kostot e kthimit janë përgjegjësi e klientit, përveç rasteve kur produkti është i dëmtuar ose i gabuar.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-8">8. Karta e Besnikërisë</h2>
            <p className="mb-4">
              Programi ynë i kartës së besnikërisë ju lejon të fitoni pikë për çdo blerje. Pikët mund të përdoren për 
              zbritje në blerjet e ardhshme. Kushtet e programit:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>1 pikë për çdo 100 lekë të shpenzuara</li>
              <li>100 pikë = 1000 lekë zbritje</li>
              <li>Pikët skadojnë pas 12 muajsh nga data e fitimit</li>
              <li>Pikët nuk janë të transferueshme</li>
            </ul>

            <h2 className="text-2xl font-bold mb-6 mt-8">9. Përgjegjësia e Kufizuar</h2>
            <p className="mb-4">
              Shtëpia e Lodrave nuk do të jetë përgjegjëse për asnjë dëm të tërthortë, të rastësishëm, të veçantë, pasues 
              ose ndëshkimor, duke përfshirë, pa kufizim, humbjen e fitimeve, të dhënave, përdorimit, vullnetit të mirë, 
              ose humbjeve të tjera të paprekshme.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-8">10. Ndryshimet në Kushtet</h2>
            <p className="mb-4">
              Ne rezervojmë të drejtën të ndryshojmë këto kushte përdorimi në çdo kohë. Ndryshimet hyjnë në fuqi menjëherë 
              pas publikimit në faqen e internetit. Përdorimi i vazhdueshëm i faqes pas ndryshimeve përbën pranimin tuaj të 
              kushteve të reja.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-8">11. Ligji Zbatueshëm</h2>
            <p className="mb-4">
              Këto kushte përdorimi rregullohen dhe interpretohen në përputhje me ligjet e Republikës së Shqipërisë. 
              Çdo mosmarrëveshje që lind nga ose në lidhje me këto kushte do të zgjidhet nga gjykatat kompetente shqiptare.
            </p>

            <h2 className="text-2xl font-bold mb-6 mt-8">12. Kontakti</h2>
            <p className="mb-4">
              Nëse keni pyetje rreth këtyre kushteve të përdorimit, ju lutemi na kontaktoni:
            </p>
            <ul className="list-none mb-4">
              <li><strong>Email:</strong> info@shtepiaelodrave.al</li>
              <li><strong>Telefon:</strong> +355 69 206 6465</li>
              <li><strong>Adresa:</strong> Rruga e Dibrës, Tiranë, Shqipëri</li>
            </ul>

            <p className="text-sm text-gray-600 mt-8">
              Data e fundit e përditësimit: {new Date().toLocaleDateString('sq-AL')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}