let currentShotPosition = null;

// Take a shot when clicking on the rink
function takeShot(event) {
    const rink = document.getElementById('rink');
    const rect = rink.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Store the position and show modal
    currentShotPosition = { x, y };
    showPlayerModal();
}

// Show the player number modal
function showPlayerModal() {
    const modal = document.getElementById('playerModal');
    const input = document.getElementById('playerNumber');
    modal.style.display = 'block';
    input.focus();
    input.value = '';
}

// Hide the modal
function hidePlayerModal() {
    const modal = document.getElementById('playerModal');
    modal.style.display = 'none';
    currentShotPosition = null;
}

// Confirm the shot with player number
async function confirmShot() {
    const playerNumber = document.getElementById('playerNumber').value;
    
    if (!playerNumber || playerNumber < 1 || playerNumber > 99) {
        alert('Please enter a valid player number (1-99)');
        return;
    }
    
    try {
        const response = await fetch('/shot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: currentShotPosition.x,
                y: currentShotPosition.y,
                playerNumber: parseInt(playerNumber)
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Add the shot marker to the rink
            addShotMarker(currentShotPosition.x, currentShotPosition.y, playerNumber);
            hidePlayerModal();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (error) {
        alert('Error saving shot: ' + error.message);
    }
}

// Cancel the shot
function cancelShot() {
    hidePlayerModal();
}

// Add shot marker to the rink
function addShotMarker(x, y, playerNumber) {
    const rink = document.getElementById('rink');
    const shot = document.createElement('div');
    shot.className = 'shot';
    shot.style.left = x + 'px';
    shot.style.top = y + 'px';
    shot.setAttribute('data-player', playerNumber);
    rink.appendChild(shot);
}

// Load all shots from server
async function loadShots() {
    try {
        const response = await fetch('/shots');
        const shots = await response.json();
        
        // Clear existing shot markers
        const existingShots = document.querySelectorAll('.shot');
        existingShots.forEach(shot => shot.remove());
        
        // Add all shots
        shots.forEach(shot => {
            addShotMarker(shot.x, shot.y, shot.playerNumber);
        });
    } catch (error) {
        alert('Error loading shots: ' + error.message);
    }
}

// Clear all shots
async function clearAllShots() {
    if (!confirm('Are you sure you want to clear all shots?')) {
        return;
    }
    
    try {
        const response = await fetch('/shots', {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Remove all shot markers from the rink
            const shots = document.querySelectorAll('.shot');
            shots.forEach(shot => shot.remove());
        }
    } catch (error) {
        alert('Error clearing shots: ' + error.message);
    }
}

// Handle Enter key in modal
document.addEventListener('DOMContentLoaded', () => {
    const playerInput = document.getElementById('playerNumber');
    if (playerInput) {
        playerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                confirmShot();
            }
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('playerModal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                cancelShot();
            }
        });
    }

    // Load existing shots on page load
    loadShots();
});