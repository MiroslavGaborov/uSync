﻿using System.Net;
using System.Web.Mvc;
using ProjectB.Core.ViewModels.Pages;
using ProjectB.Models.Generated;

namespace ProjectB.Core.Controllers.RenderMvc
{
	public class Error404Controller : BasePageController<Error404>
	{
		public ActionResult Error404(Error404 model)
		{
			Response.StatusCode = (int) HttpStatusCode.NotFound;
			Response.Status = "404 not found";
			Response.TrySkipIisCustomErrors = true;

			// CurrentTemplate won't work here as this controller may be hit from custom made route
			return View(new Error404ViewModel(CreatePageContext(model)));
		}
	}
}
