// ===== Stampzer — site configuration =====
// This is the only file you normally need to edit.
// Change a value, save, and re-upload this file.
window.STAMPZER_CONFIG = {
  // Where the waitlist form sends sign-ups.
  // Paste a Formspree endpoint (or your own API URL) to start collecting e-mails.
  //   Example: "https://formspree.io/f/abcdwxyz"
  // Leave as null to just show the "Je staat op de lijst!" message without sending anywhere.
  waitlistEndpoint: "/lead.php",

  // Microsoft Clarity project ID — heatmaps + session recordings. Set to null to turn off.
  clarityProjectId: "x951bddg9b",
};
