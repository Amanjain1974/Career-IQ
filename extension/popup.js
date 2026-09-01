document.getElementById('saveBtn').addEventListener('click', async () => {
  const btn = document.getElementById('saveBtn');
  const statusEl = document.getElementById('status');
  
  const company = document.getElementById('company').value || 'Unknown Company';
  const role = document.getElementById('role').value || 'Unknown Role';
  const location = document.getElementById('location').value || 'Unknown Location';
  const workMode = document.getElementById('workMode').value;
  
  btn.disabled = true;
  statusEl.innerText = "Extracting text from page...";
  statusEl.style.color = "#4b5563";

  // Get current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Execute script to get text
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractPageText
  }, async (injectionResults) => {
    const text = injectionResults[0].result;
    
    statusEl.innerText = "Saving to CareerIQ...";
    
    try {
      // Assuming user is logged in on localhost:5173 and token is maybe shared or we just send it if backend is auth-less for this POC
      // For a real extension, we would use chrome.storage to store the JWT token and pass it in Headers
      
      const response = await fetch('http://localhost:8000/api/jobs/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer <token>' // Need token logic here for production
        },
        body: JSON.stringify({
          company: company,
          role: role,
          location: location,
          work_mode: workMode,
          description: text,
          url: tab.url
        })
      });
      
      if (response.ok) {
        statusEl.innerText = "Job successfully saved!";
        statusEl.style.color = "green";
      } else {
        statusEl.innerText = "Failed to save (Auth error?).";
        statusEl.style.color = "red";
      }
    } catch (e) {
      statusEl.innerText = "Network error connecting to CareerIQ.";
      statusEl.style.color = "red";
    }
    
    btn.disabled = false;
  });
});

function extractPageText() {
  // Grab the main text from the body
  return document.body.innerText;
}
