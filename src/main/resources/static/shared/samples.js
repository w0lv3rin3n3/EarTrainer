async function createSamplesList() {
    await fetch(`http://localhost:8080/samples`)
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
                option.value = `http://localhost:8080/samples/${data[index].id}/data`;
                option.innerHTML = data[index].fileName;
                samples.appendChild(option);
            }
            // console.log(`Randoms are generated: ${randomFreq} , ${randomGain} , ${randomQ} for questionFilter`);
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

await createSamplesList();