const level = Number(document.getElementById('level').value) + 1;

export async function createMelodiesList() {
    await fetch(`http://localhost:8080/melodies/${level}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const samples = document.querySelector('.samples');
            for(let index = 0; index < data.length; index++) {
                const option = document.createElement('option');
                option.value = `${data[index].id}`;
                option.innerHTML = data[index].fileName + ` (${data[index].level})`;
                samples.appendChild(option);
            }
            // console.log(`Randoms are generated: ${randomFreq} , ${randomGain} , ${randomQ} for questionFilter`);
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

await createMelodiesList();