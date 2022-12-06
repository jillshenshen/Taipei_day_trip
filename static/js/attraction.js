let url = window.location.pathname
    let newUrl = `/api${url}`
    const getPage = async () => {
    	let data = await fetch(newUrl);
    	let parseData = await data.json();
    	let getData = parseData.data
    	let img_url = getData.images
    	for (let i = 0; i < img_url.length; i++) {
    		const images = document.querySelector(".images")
    		const image = document.createElement("img")
    		image.classList.add("image")
    		image.src = img_url[i]
    		images.append(image)
    		let btnSliders = document.querySelector(".btn-sliders")
    		let span = document.createElement("span")
    		span.classList.add("white")
    		if (i == 0) {
    			span.classList.add("black")
    		}
    		span.setAttribute("onclick", `btnSlide(${i+1})`)
    		btnSliders.append(span)
    	}
    	const right = document.querySelector(".right-content")
    	const description = document.querySelector(".description")
    	const address = document.querySelector(".address")
    	const transport = document.querySelector(".transport")
    	let name = getData.name
    	let category = getData.category
    	let mrt = getData.mrt
    	let des = getData.description
    	let add = getData.address
    	let trans = getData.transport
    	const h1Name = document.createElement("h1")
    	const mrtName = document.createElement("h2")
    	h1Name.innerText = name
    	mrtName.innerText = `${category} at ${mrt}`
    	right.append(h1Name, mrtName)
    	description.innerText = des
    	address.innerText = add
    	transport.innerText = trans
    
    }
    getPage()
    let indexValue = 1;

    function btnSlide(e) {
    	showImg(indexValue = e)
    }

    function sideSlide(e) {
    	showImg(indexValue += e)
    }

    function showImg(e) {
    	let i;
    	const img = document.querySelectorAll(".image");
    	const sliders = document.querySelectorAll(".btn-sliders span")
    	const dot = document.querySelectorAll(".white")
    	if (e > img.length) {
    		indexValue = 1;
    	}
    	if (e < 1) {
    		indexValue = img.length
    	}
    	for (i = 0; i < img.length; i++) {
    		img[i].style.display = "none";
    		dot[i].classList.remove("black")
    	}
    	// 顯示圖片
    	img[indexValue - 1].style.display = "block"
    	// 顯示黑點
    	dot[indexValue - 1].classList.add("black")
    }
    let expense = document.querySelectorAll("input[name='expense']")
    let findSelected = () => {
    	let cost = document.querySelector(".cost")
    	let selected = document.querySelector("input[name='expense']:checked")
    	if (selected.value == "morning") {
    		cost.innerText = "新台幣2000元"
    	}
    	if (selected.value == "afternoon") {
    		cost.innerText = "新台幣2500元"
    	}
    }
    expense.forEach(expense => {
    	expense.addEventListener("change", findSelected)
    })


