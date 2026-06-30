/* =============================================================================
   Valentin Boussot — selected publications.

   Records are transcribed from the thesis publication list and enriched only
   with live-verified arXiv/DOI metadata. Unknown publication years and links
   stay null rather than being inferred. Last verified: 2026-06-28.
   ========================================================================== */

(function () {
  "use strict";

  var publications = [
    {
      name: "IMPACT: A Generic Semantic Loss for Multimodal Medical Image Registration",
      authorsShort: "Boussot V., Hémon C., Nunes J-C., Dowling J., Rouzé S., Lafond C., Barateau A., Dillenseger J-L.",
      venue: "arXiv · submitted to Computerized Medical Imaging and Graphics",
      year: 2025,
      type: "preprint",
      status: "under review",
      link: "https://arxiv.org/abs/2503.24121",
      linkLabel: "arXiv:2503.24121"
    },
    {
      name: "KonfAI: A Modular and Fully Configurable Framework for Deep Learning in Medical Imaging",
      authorsShort: "Boussot V., Dillenseger J-L.",
      venue: "arXiv",
      year: 2025,
      type: "preprint",
      status: "published",
      link: "https://arxiv.org/abs/2508.09823",
      linkLabel: "arXiv:2508.09823"
    },
    {
      name: "When Misalignment Becomes Supervision: Structured Label Noise in Supervised Synthetic CT Generation",
      authorsShort: "Boussot V., Hémon C., Lafond C., Nunes J-C., Dillenseger J-L.",
      venue: "preprint · the registration-bias study",
      year: 2026,
      type: "preprint",
      status: "under review",
      link: null,
      linkLabel: null
    },
    {
      name: "TotalSynth: Robust Whole-Body Synthetic CT from MRI and CBCT",
      authorsShort: "Boussot V., Hémon C., Barateau A., Lafond C., Nunes J-C., Dillenseger J-L.",
      venue: "preprint · whole-body sCT trained at scale on 1,800+ CBCT and MR patients",
      year: 2026,
      type: "preprint",
      status: "under review",
      link: null,
      linkLabel: null
    },
    {
      name: "Why Registration Quality Matters: Enhancing sCT Synthesis with IMPACT-Based Registration",
      authorsShort: "Boussot V., Hémon C., Nunes J-C., Dillenseger J-L.",
      venue: "SynthRAD2025 Challenge · MICCAI",
      year: 2025,
      type: "preprint",
      status: "published",
      link: "https://arxiv.org/abs/2510.21358",
      linkLabel: "arXiv:2510.21358"
    },
    {
      name: "Generating synthetic computed tomography for radiotherapy: SynthRAD2025 challenge report",
      authorsShort: "Rogowski V., …, Boussot V., …, Maspero M.",
      venue: "Medical Image Analysis",
      year: 2026,
      type: "journal",
      status: "under review",
      link: "https://arxiv.org/abs/2605.13555",
      linkLabel: "arXiv:2605.13555"
    },
    {
      name: "MRIgRT real-time target tracking: TrackRAD2025 challenge report",
      authorsShort: "Blöker T-J., …, Boussot V., …, Landry G.",
      venue: "Medical Image Analysis",
      year: 2026,
      type: "journal",
      status: "published",
      link: "https://doi.org/10.1016/j.media.2026.104134",
      linkLabel: "DOI: 10.1016/j.media.2026.104134"
    },
    {
      name: "PANTHER Challenge Report: Cross-Domain Pancreatic Tumor Segmentation in Magnetic Resonance Imaging",
      authorsShort: "Amparo S., …, Boussot V., …, Koopmans Peter J. ",
      venue: "Medical Image Analysis",
      year: 2026,
      type: "journal",
      status: "published",
      link: "https://doi.org/10.1016/j.media.2026.104186",
      linkLabel: "DOI: 10.1016/j.media.2026.104186"
    },
    {
      name: "Assessing Pancreatic Ductal Adenocarcinoma Vascular Invasion: the PDACVI Benchmark",
      authorsShort: "Riera-Marín M., …, Boussot V., …, Galdran A.",
      venue: "Medical Image Analysis",
      year: 2026,
      type: "journal",
      status: "under review",
      link: "https://arxiv.org/abs/2604.27582",
      linkLabel: "arXiv:2604.27582"
    },
    {
      name: "Calibration and Uncertainty for multiRater Volume Assessment in multiorgan Segmentation (CURVAS) challenge results",
      authorsShort: "Riera-Marín M., …, Boussot V., Galdran A.",
      venue: "Computers in Biology and Medicine",
      year: 2025,
      type: "journal",
      status: "published",
      link: "https://doi.org/10.1016/j.compbiomed.2025.111024",
      linkLabel: "DOI: 10.1016/j.compbiomed.2025.111024"
    },
    {
      name: "An Uncertainty Estimation Framework for Dose Accumulation in Adaptive Radiotherapy: Application to CBCT-Guided Radiotherapy for Cervical Cancer",
      authorsShort: "Hémon C., Lebret D., …, Boussot V., …, Lafond C.",
      venue: "Computers in Biology and Medicine",
      year: 2026,
      type: "journal",
      status: "under review",
      link: "https://arxiv.org/abs/2606.11012",
      linkLabel: "arXiv:2606.11012"
    },
    {
      name: "Generating synthetic computed tomography for radiotherapy: SynthRAD2023 challenge report",
      authorsShort: "Huijben E., …, Boussot V., …, Maspero M.",
      venue: "Medical Image Analysis",
      year: 2024,
      type: "journal",
      status: "published",
      link: "https://doi.org/10.1016/j.media.2024.103276",
      linkLabel: "DOI: 10.1016/j.media.2024.103276"
    },
    {
      name: "Modeling dose uncertainty in cone-beam computed tomography: Predictive approach for deep learning-based synthetic computed tomography generation",
      authorsShort: "Hémon C., Cubero L., Boussot V., …, Nunes J-C.",
      venue: "Physics and Imaging in Radiation Oncology",
      year: 2025,
      type: "journal",
      status: "published",
      link: "https://doi.org/10.1016/j.phro.2025.100704",
      linkLabel: "DOI: 10.1016/j.phro.2025.100704"
    },
    {
      name: "Leverage SAM power for medical imaging",
      authorsShort: "Boussot V., Hémon C., Nunes J-C., Dillenseger J-L.",
      venue: "TrackRAD Challenge · MICCAI",
      year: 2025,
      type: "conference",
      status: "published",
      link: null,
      linkLabel: null
    },
    {
      name: "From Deterministic to Probabilistic: Bayesian Modeling of Inter-Annotator Variability in UNet-Based Segmentation",
      authorsShort: "Hémon C., Boussot V., Dillenseger J-L., Nunes J-C.",
      venue: "CURVAS-PDACVI Challenge · MICCAI",
      year: 2025,
      type: "conference",
      status: "published",
      link: null,
      linkLabel: null
    },
    {
      name: "Statistical model for the prediction of lung deformation during video-assisted thoracoscopic surgery",
      authorsShort: "Boussot V., Dillenseger J-L.",
      venue: "SPIE Medical Imaging",
      year: 2023,
      type: "conference",
      status: "published",
      link: "https://doi.org/10.1117/12.2646983",
      linkLabel: "DOI: 10.1117/12.2646983"
    },
    {
      name: "Adapting 3D pretrained TotalSegmentator model for Bayesian segmentation uncertainty estimation",
      authorsShort: "Hémon C., Boussot V., Dillenseger J-L., Nunes J-C.",
      venue: "CURVAS2024 Challenge · MICCAI",
      year: 2024,
      type: "conference",
      status: "published",
      link: null,
      linkLabel: null
    },
    {
      name: "Guiding unsupervised CBCT-to-CT synthesis using content and style representation (CREPs loss)",
      authorsShort: "Hémon C., Boussot V., Texier B., Dillenseger J-L., Nunes J-C.",
      venue: "SynthRAD2023 Challenge · MICCAI",
      year: 2023,
      type: "conference",
      status: "published",
      link: null,
      linkLabel: null
    },
    {
      name: "Modèle statistique pour la prédiction de la déformation du poumon pendant la chirurgie thoracique vidéo-assistée",
      authorsShort: "Boussot V., Dillenseger J-L.",
      venue: "RITS",
      year: 2022,
      type: "conference",
      status: "published",
      link: null,
      linkLabel: null
    }
  ];

  window.siteContent = window.siteContent || {};
  window.siteContent.publications = publications;
})();
