# GetSchwifty.js
GetSchwifty.js - an experimental javascript canvas animation thingy mbob

View the [Demo Page](https://joepagan.github.io/GetSchwifty.js/).

GetSchwifty.js loads in an image in block by block from top left to bottom right, it then disperse the blocks in an inverted pattern to obfuscate the image.

To utilise this plugin you here are the basic you need in your template:

    <canvas id="canvas"></canvas>

    <script src="GetSchwifty.js"></script>

    <script>
        var GetSchwifty = new GetSchwifty({
            selector: "#canvas", // using document.querySelector for flexibility
            rowPieces: 8, // how many pieces you would like the image to be split into on the x axis
            columnPieces: 8, // how many pieces you would like the image to be split into on the y axis
            yUpdateSpeed: 50, // This will update the position of the image's pieces by a set pixel value, to be as smooth as possible you would use a value of 1, though this would make the animation very slow
            xUpdateSpeed: 50, // This will update the position of the image's pieces by a set pixel value, to be as smooth as possible you would use a value of 1, though this would make the animation very slow
            img: "rick-and-morty-get-schwifty.jpg", // Set a path to the image you would like to use
            width: window.innerWidth, // The width can be set with JS if you'd like instead of utilising attributes on the canvas element. This means you can use window.innerWidth for example
            height: window.innerHeight // The height can be set with JS if you'd like instead of utilising attributes on the canvas element. This means you can use window.innerHeight for example
        });
    </script>
