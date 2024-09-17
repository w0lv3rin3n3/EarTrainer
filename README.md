<p align='justify'>
  Obiectivul principal al acestui proiect este oferirea unei soluții complete pentru inginerii din domeniul audio pentru a putea evolua și antrena urechea din punct de vedere tehnic. Această platformă dezvoltată este una cu nivel de finanțe redus, utilizatorii putând să acceseze exercițiile din cadrul aplicației gratuit, și care îndeplinește cerințele unui sistem inteligent și inovator. Implementarea proiectului este facilă, iar aplicația poate fi ușor de accesat și folosit în viața de zi cu zi de către utilizatori, astfel devenind o soluție de luat în calcul când vine vorba de antrenamentul tehnic al urechii al profesioniștilor din ingineria sunetului, dar și pentru utilizatorii care sunt doar pasionați de domeniul audio și de toate exercițiile oferite în cadrul platformei.
</p>

<p align='justify'>
În pagina principală, cea de Home, utilizatorul poate avea acces la toate informațiile și exercițiile conținute în aplicația web. De asemenea, dacă niciun utilizator nu este conectat prin folosirea contului de utilizator, antetul paginii se modifică dinamic, alterând anumite clase specifice definite în HTML. De exemplu, atunci când niciun utilizator nu este conectat, este afișat, pe lângă logo-ul aplicației și meniul static ce conține toate paginile aplicației, un buton cu eticheta ”Login”. Acesta oferă o experiență plăcută utilizatorului, acesta aflând, în mod intuitiv, că trebuie să se conecteze cu ajutorul unui cont pentru a profita de toate funcționalitățile conținute în interiorul aplicației.
</p>

![image](https://github.com/user-attachments/assets/bb8b6fee-b4ab-4b3c-9d3c-3063760a849a)

<p align='justify'>
Opțiunea de conectare la un cont deja existent, sau crearea unui cont nou, este disponibilă în cadrul fiecărei pagini din aplicația web, aceasta ajutând interacțiunea cât mai simplă a utilizatorului, nefiind nevoit să navigheze într-o pagină specifică doar pentru a se conecta la un cont de utilizator. De asemenea, funcționalitățile complete ale aplicației sunt accesibile doar pentru clienții care au cont și sunt și conectați pe parcursul rezolvării exercițiilor din cadrul aplicației. Altfel, dacă utilizatorii nu sunt conectați, aceștia nu pot observa progresul monitorizat în baza de date pe parcursul răspunsurilor oferite la diferite exerciții.
</p>

<p align='center'>
  <img align='center' src='https://github.com/user-attachments/assets/0c8af154-5508-4904-97f6-d1b203eaf95f'> </img>
</p>

<p align='justify'>
Prin stilizarea elementului HTML Canvas am reușit să ofer utilizatorului experiența unui egalizator parametric într-un cadru online. În prim-plan se află o funcție gausiană ce imită afișarea unui filtru de tip ”peaking”. Vârful acesteia poate fi mutat cu ajutorul cursorului de către utilizator, pe orizontală fiind modificate valorile parametrului frecvență transmis filtrului, iar pe verticală fiind modificate valorile parametrului tărie. De asemenea, factorul de calitate Q poate fi alterat folosind knob-ul din dreapta jos și acesta modifică practic deviația standard a funcției gausiene, mărind sau micșorând astfel lobul afișat. 
</p>

![image](https://github.com/user-attachments/assets/bd36d56b-f207-4ce2-a761-8d0893c74980)

<p align='justify'>
Pagina Gain este una cu o interfață simplă a utilizatorului, aceasta având 3 secțiuni: antetul, secțiunea principală a exercițiului și fragmentul de control. Pentru ca pagina să fie intuitivă, antetul este afișat la fel ca la exercițiul specific pentru ghicirea parametrilor egalizatorului, având acces la întreg meniul de navigare prin cele 7 pagini, cât și la schimbarea nivelului de dificultate al exercițiului sau a semnalului audio provenit din baza de date.
Cu ajutorul butonului de tip listă conținute în secțiunea antetului, cel prin care utilizatorul poate alege semnalul sonor pe care dorește să efectueze testarea și exercițiul ghicirii nivelului de tărie, aplicația web trimite o cerere la aplicația server și aceasta deservește rutina prin metode de tip GET ce apelează diferite rute definite în aplicația server. La apelul rutei pentru schimbarea sursei intrării audio, aplicația server știe că va trebui să trimită un obiect în format JSON(JavaScript Object Notation) către front-end, iar acest obiect, odată ajuns în cadrul părții clientului este preluat și se atribuie parametrului audio.src vectorul de octeți data provenit din obiectul transmis din baza de date – acesta reprezentând toată informația conținută de fișierul audio. 
</p>

![image](https://github.com/user-attachments/assets/c32a29af-136a-4439-8665-edf97b9f06fc)

<p align='justify'>
Pianul este alcătuit din numeroase elemente div în HTML și stilizate astfel încât să arate cât mai aproape de clapele unui pian real. Clapele negre sunt micșorate și sunt așezate cu atenție între cele albe, poziționarea acestora fiind realizată cu ajutorul componentei CSS. De asemenea, am ales să pun etichete pe fiecare clapă astfel încât inginerii ce vor utiliza această aplicație să realizeze conexiunea între nota ce se aude și frecvența corespunzătoare oscilatorului. Un alt element ce înfrumusețează interfața este acela că atunci când utilizatorul aude frecvența oscilatorului, după ce este apăsat butonul de redare, acesta poate apăsa folosind cursorul pe clapele pianului și acestea se colorează în culoarea galbenă, pentru a fi identificate ușor de către utilizator.
</p>

![image](https://github.com/user-attachments/assets/d7cb85b9-6623-4c1f-abe6-edc080171f58)

<p align='justify'>
Secțiunea principală a paginii Instruments conține 8 iconițe centrate ce reprezintă mai multe instrumente muzicale, precum și vocea. Aceste imagini sunt reprezentative pentru pian, chitară electrică, chitară acustică, chitară bass, tobe sau percuție, vioară, saxofon și vocea principală. Toate aceste tipuri de semnal audio se regăsesc în interiorul exercițiilor și în momentul în care utilizatorul selectează uni nvel și o piesă, și apasă și butonul de redare, se vor auzi mai multe sau mai puține elemente iar acesta trebuie să identifice ce tipuri de semnale sonore ajung la destinația finală a lanțului audio. Prin apăsarea pe iconițele reprezentative, utilizatorul poate selecta ce instrumente se aud în cadrul audiției. După selectarea instrumentului, acesta se va colora, pentru ca utilizatorul să fie informat cu privire la răspunsul care va fi transmis către baza de date. După selecția butonului de verificare a răspunsului, aplicația va colora căsuțele specifice elementelor în culori diferite: verde pentru element identificat corect, galben pentru element ce era redat dar nu a fost identificat și roșu pentru elemente identificate incorect. Prin apăsarea butonului Next Question, se generează un alt test și interfața revine la forma inițială de reset.
</p>

![image](https://github.com/user-attachments/assets/d1b397fe-e4cb-43d5-94b6-075f232a80b7)

<p align='justify'>
Secțiunea principală a acestei pagini este una mai specială deoarece am folosit o tehnologie și un mediu de dezvoltare nou și anume Three.JS. Acesta este un mediu de dezvoltare, o bibliotecă ce vine în ajutorul dezvoltatorilor web pentru a putea crea modele 3D, a pune în valoare spațiul tridimensional sau pentru a crea o interfață interesantă pentru interacțiunea cu utilizatorul. Three.JS este unul din cele mai cunoscute și folosite framework-uri pentru integrarea spațiului tridimensional în interiorul unei pagini web.
</p>

![image](https://github.com/user-attachments/assets/fa6681e2-a77b-45b5-a955-bd3ba83d000e)

<p align='justify'>
Pagina de utilizator unde persoanele care se vor autentifica în cadrul aplicației de antrenare și dezvoltare a urechii din punct de vedere tehnic pot accesa rezultatele exercițiilor multiple oferite pe platformă. Aceștia vor putea vizualiza statisticile răspunsurilor personale în cadrul unui tabel ce conține 10 linii afișate per pagină. Filtrarea tabelului se poate face prin folosirea celor 2 butoane de tip listă din antetul paginii. Utilizatorii vor putea alege dacă statisticile sunt afișate doar pentru contul curent sau pentru toți utilizatorii care au folosit aplicația, dar vor putea filtra răspunsul tabelului și prin alegerea tipului de exercițiu la care doresc să vizualizeze rezultatele.
	O funcționalitate care va fi dezvoltată în viitor va fi cea de sortare a liniilor din tabel după câmpurile principale afișate: numărul de identificare a intrării din tabel, numele de utilizator, locația din care utilizatorul a creat contul, data de la care acesta este membru al platformei, exercițiul de test, numărul de întrebări la care s-au dat răspunsuri, nivelul de dificultate și media scorului.
</p>

![image](https://github.com/user-attachments/assets/e25f233a-51ad-4c39-a9f3-9c39f9088b19)



