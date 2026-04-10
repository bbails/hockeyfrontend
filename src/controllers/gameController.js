class GameController {
    constructor() {
        // In-memory storage for shots (in production, use a database)
        this.shots = [];
    }

    renderRink(req, res) {
        res.render('index', { title: 'Ice Hockey Rink', shots: this.shots });
    }

    processShot(req, res) {
        const { x, y, playerNumber } = req.body;
        
        // Validate player number
        if (!playerNumber || isNaN(playerNumber)) {
            return res.status(400).json({ 
                error: 'Valid player number is required' 
            });
        }

        // Create shot data
        const shotData = {
            id: Date.now(), // Simple ID generation
            x: parseFloat(x),
            y: parseFloat(y),
            playerNumber: parseInt(playerNumber),
            timestamp: new Date().toISOString()
        };

        // Save the shot
        this.shots.push(shotData);

        res.json({ 
            message: 'Shot saved successfully!', 
            shot: shotData,
            totalShots: this.shots.length
        });
    }

    getShots(req, res) {
        res.json(this.shots);
    }

    clearShots(req, res) {
        this.shots = [];
        res.json({ message: 'All shots cleared' });
    }
}

module.exports = GameController;